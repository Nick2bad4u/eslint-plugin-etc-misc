import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

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
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require arrow-function properties when `this` is not required.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-arrow-function-property",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer arrow function properties.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "prefer-arrow-function-property",
});

export default rule;
