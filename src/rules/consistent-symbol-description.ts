import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = String.raw`CallExpression[callee.name='Symbol'] > Literal:not([value=/^(?:[\d\-a-z]|__)+$/u])`;

/**
 * Require `Symbol` descriptions to use kebab-case style.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
        create: (context) => ({
            [disallowedSelector]: (node: Readonly<es.Node>): void => {
                context.report({
                    messageId: "forbidden",
                    node,
                });
            },
        }),
        defaultOptions: [],
        meta: {
            docs: {
                description: "require consistent kebab-case symbol descriptions.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/consistent-symbol-description.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Prefer kebab-case Symbol descriptions.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "consistent-symbol-description",
    });

export default rule;
