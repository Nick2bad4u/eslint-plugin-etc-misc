import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector =
    "ArrowFunctionExpression[returnType=undefined] > :matches(TSAsExpression, TSTypeAssertion) > :matches(FunctionExpression, ArrowFunctionExpression, ObjectExpression, ClassExpression)";

/**
 * Disallow inferred complex return types for arrow functions.
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
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow complex inferred arrow-function return types without explicit annotation.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-complex-return-type",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Add an explicit return type annotation for complex return expressions.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-complex-return-type",
});

export default rule;
