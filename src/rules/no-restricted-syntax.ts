import { ruleCreator } from "../_internal/rule-creator";
import {
    buildRestrictedSyntaxListeners,
    normalizeSyntaxSelector,
    type SyntaxSelectorOption,
} from "../_internal/syntax-selectors";

type MessageIds = "customMessage" | "forbidden";

type Options = readonly [
    Readonly<{
        selectors?: readonly SyntaxSelectorOption[];
    }>,
];

/**
 * Disallow syntax nodes matched by configured selectors.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
        create: (context, [options]) => {
            const selectors = options.selectors ?? [];
            const entries = selectors.map((selector) =>
                normalizeSyntaxSelector(selector)
            );

            return buildRestrictedSyntaxListeners(entries, (node, entry) => {
                if (entry.message !== undefined) {
                    context.report({
                        data: {
                            message: entry.message,
                        },
                        messageId: "customMessage",
                        node,
                    });
                    return;
                }

                context.report({
                    messageId: "forbidden",
                    node,
                });
            });
        },
        defaultOptions: [{ selectors: [] }],
        meta: {
            defaultOptions: [{ selectors: [] }],
            docs: {
                description:
                    "disallow syntax nodes selected by configured AST selectors.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-restricted-syntax.md",
            },
            hasSuggestions: false,
            messages: {
                customMessage: "{{message}}",
                forbidden: "Disallowed syntax.",
            },
            schema: [
                {
                    additionalProperties: false,
                    description:
                        "Configuration for syntax selectors to disallow.",
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
            type: "problem",
        },
        name: "no-restricted-syntax",
    });

export default rule;
