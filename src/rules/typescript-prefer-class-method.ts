import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector =
    "PropertyDefinition:not([typeAnnotation]) > ArrowFunctionExpression";

/**
 * Prefer class methods over untyped arrow-function class properties.
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
                "require class methods over untyped arrow-function class properties.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-class-method",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Use a class method instead of an untyped function property.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-class-method",
});

export default rule;
