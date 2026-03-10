import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    ":not(VariableDeclarator) > CallExpression > Identifier.callee[name='require']";

/**
 * Require `require(...)` calls to be assigned to a const variable.
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
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require require() calls to be assigned to const.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-const-require",
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
