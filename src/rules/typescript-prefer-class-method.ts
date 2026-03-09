import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Prefer class methods over untyped arrow-function class properties.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "prefer class methods over untyped arrow-function class properties.",
    message: "Use a class method instead of an untyped function property.",
    messageId: "forbidden",
    name: "typescript/prefer-class-method",
    selector:
        "PropertyDefinition:not([typeAnnotation]) > ArrowFunctionExpression",
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-class-method",
});

export default rule;
