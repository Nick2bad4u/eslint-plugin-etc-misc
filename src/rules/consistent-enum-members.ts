import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

// eslint-disable-next-line etc-misc/no-unnecessary-template-literal -- String.raw preserves selector escapes.
const selector = String.raw`TSEnumMember:not([id.name=/^[A-Z][A-Z_\d]*$/u], [initializer.value=/^[A-Z][A-Z_\d]*$/u])`;

/**
 * Enforce SCREAMING_SNAKE_CASE enum member names and literal values.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce SCREAMING_SNAKE_CASE enum member names and string literal values.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-enum-members",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Enum member names and string values must use SCREAMING_SNAKE_CASE.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "consistent-enum-members",
});

export default rule;
