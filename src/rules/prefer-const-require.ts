import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    ":not(VariableDeclarator) > CallExpression > Identifier.callee[name='require']";

/**
 * Require `require(...)` calls to be assigned to a const variable.
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
                description: "require require() calls to be assigned to const.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-const-require.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Assign require() results to a const variable.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "prefer-const-require",
    });

export default rule;
