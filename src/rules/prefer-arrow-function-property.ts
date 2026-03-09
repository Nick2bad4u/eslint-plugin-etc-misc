import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "Property > FunctionExpression.value:not([params.0.name='this'])";

/**
 * Prefer arrow-function object properties over function-expression properties.
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
        docs: {
            description:
                "require arrow-function properties when `this` is not required.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-arrow-function-property.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Prefer arrow function properties.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "prefer-arrow-function-property",
});

export default rule;
