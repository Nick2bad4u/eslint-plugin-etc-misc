import type { TSESTree as es } from "@typescript-eslint/utils";

import { isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    normalizeSyntaxSelector,
    type SyntaxSelectorOption,
} from "../_internal/syntax-selectors.js";

type MessageIds = "customMessage" | "missing";

type Options = readonly [
    Readonly<{
        readonly selectors?: readonly SyntaxSelectorOption[];
    }>,
];

/**
 * Require at least one occurrence of each configured syntax selector.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const entries = (options.selectors ?? []).map((selector) =>
            normalizeSyntaxSelector(selector)
        );
        const counters = entries.map(() => 0);

        let selectorListeners: Readonly<
            Record<string, (node: Readonly<es.Node>) => void>
        > = {};

        for (const [index, entry] of entries.entries()) {
            selectorListeners = {
                ...selectorListeners,
                [entry.selector]: (): void => {
                    const count = counters[index] ?? 0;
                    counters[index] = count + 1;
                },
            };
        }

        return {
            ...selectorListeners,
            "Program:exit": (node: Readonly<es.Program>): void => {
                for (const [index, entry] of entries.entries()) {
                    const count = counters[index] ?? 0;
                    if (count === 0) {
                        if (isDefined(entry.message)) {
                            context.report({
                                data: {
                                    message: entry.message,
                                },
                                messageId: "customMessage",
                                node,
                            });
                        } else {
                            context.report({
                                data: {
                                    selector: entry.selector,
                                },
                                messageId: "missing",
                                node,
                            });
                        }
                    }
                }
            },
        };
    },
    meta: {
        defaultOptions: [{ selectors: [] }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require at least one match for each configured AST selector.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-syntax",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            customMessage: "{{message}}",
            missing: "Required syntax '{{selector}}' was not found.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for syntax selectors that must appear at least once.",
                properties: {
                    selectors: {
                        description:
                            "Selector list. Each entry can be a selector string or a selector/message object.",
                        items: {
                            oneOf: [
                                {
                                    minLength: 1,
                                    type: "string",
                                },
                                {
                                    additionalProperties: false,
                                    properties: {
                                        message: {
                                            minLength: 1,
                                            type: "string",
                                        },
                                        selector: {
                                            minLength: 1,
                                            type: "string",
                                        },
                                    },
                                    required: ["selector"],
                                    type: "object",
                                },
                            ],
                        },
                        type: "array",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "require-syntax",
});

export default rule;
