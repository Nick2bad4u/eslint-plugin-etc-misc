import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = String.raw`CallExpression[callee.name='Symbol'] > Literal:not([value=/^(?:[\da-z-]|__)+$/u])`;

/**
 * Require `Symbol` descriptions to use kebab-case style.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [disallowedSelector]: (node: Readonly<es.Node>): void => {
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
            description: "require consistent kebab-case symbol descriptions.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-symbol-description",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer kebab-case Symbol descriptions.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "consistent-symbol-description",
});

export default rule;
