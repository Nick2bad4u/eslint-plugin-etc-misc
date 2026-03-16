import type { TSESTree as es } from "@typescript-eslint/utils";

import { resolve } from "node:path";
import { isDefined } from "ts-extras";

import { type Casing, filenameStem, toCasing } from "../_internal/casing.js";
import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "mismatch";

type Options = readonly [
    Readonly<{
        readonly format?: Casing;
        readonly match?: boolean;
        readonly prefix?: string;
        readonly selector?: readonly string[] | string;
        readonly suffix?: string;
    }>,
];

const defaultSelectors = [
    "ClassDeclaration > Identifier.id",
    "FunctionDeclaration > Identifier.id",
    "TSInterfaceDeclaration > Identifier.id",
    "TSTypeAliasDeclaration > Identifier.id",
] as const;

const normalizeSelector = (
    selector: Options[0]["selector"]
): readonly string[] => {
    if (!isDefined(selector)) {
        return defaultSelectors;
    }

    if (typeof selector === "string") {
        return [selector];
    }

    return selector;
};

/**
 * Enforce that selected declaration identifiers match the current filename.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => {
        const selectorList = normalizeSelector(options.selector);
        let listeners: Readonly<
            Record<string, (node: Readonly<es.Node>) => void>
        > = {};

        for (const selector of selectorList) {
            listeners = {
                ...listeners,
                [selector]: (node: Readonly<es.Node>): void => {
                    if (
                        context.filename === "<input>" ||
                        node.type !== "Identifier"
                    ) {
                        return;
                    }

                    const stem = filenameStem(resolve(context.filename));
                    const expected = `${options.prefix ?? ""}${toCasing(
                        node.name,
                        options.format ?? "kebab-case"
                    )}${options.suffix ?? ""}`;
                    const matches = stem === expected;

                    if ((options.match ?? true) ? matches : !matches) {
                        return;
                    }

                    context.report({
                        data: {
                            expected,
                        },
                        messageId: "mismatch",
                        node,
                    });
                },
            };
        }

        return listeners;
    },
    defaultOptions: [{ format: "kebab-case", match: true }],
    meta: {
        defaultOptions: [{ format: "kebab-case", match: true }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce selected declaration identifiers to match filename casing.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/match-filename",
        },
        hasSuggestions: false,
        messages: {
            mismatch: "Identifier should match filename '{{expected}}'.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for declaration-name to filename matching.",
                properties: {
                    format: {
                        description:
                            "Casing format applied to declaration identifiers.",
                        enum: [
                            "camelCase",
                            "kebab-case",
                            "PascalCase",
                        ],
                        type: "string",
                    },
                    match: {
                        description:
                            "Whether declaration names must match (true) or must differ from (false) filename.",
                        type: "boolean",
                    },
                    prefix: {
                        description:
                            "Prefix expected before transformed identifier.",
                        type: "string",
                    },
                    selector: {
                        description:
                            "Selector(s) used to pick declaration identifiers to compare.",
                        oneOf: [
                            {
                                description: "Single selector string.",
                                type: "string",
                            },
                            {
                                description: "Multiple selector strings.",
                                items: {
                                    description: "Selector string.",
                                    type: "string",
                                },
                                type: "array",
                            },
                        ],
                    },
                    suffix: {
                        description:
                            "Suffix expected after transformed identifier.",
                        type: "string",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "match-filename",
});

export default rule;
