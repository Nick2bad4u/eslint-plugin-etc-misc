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
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-prefer-class-method.md",
});

export default rule;
