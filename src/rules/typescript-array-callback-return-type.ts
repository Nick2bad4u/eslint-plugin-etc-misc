import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector =
    ":matches(CallExpression, OptionalCallExpression):matches([callee.property.name='every'], [callee.property.name='find'], [callee.property.name='findLast'], [callee.property.name='findIndex'], [callee.property.name='findLastIndex'], [callee.property.name='flatMap'], [callee.property.name='forEach'], [callee.property.name='map'], [callee.property.name='some']) > :matches(FunctionExpression, ArrowFunctionExpression):not([returnType])";

/**
 * Require explicit return types for array callback functions.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require explicit return types for array callback functions.",
    message: "Specify the callback return type explicitly.",
    messageId: "forbidden",
    name: "typescript/array-callback-return-type",
    selector,
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-array-callback-return-type",
});

export default rule;
