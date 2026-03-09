import { createSelectorRule } from "../_internal/create-selector-rule";

const selector =
    "ArrowFunctionExpression[returnType=undefined] > :matches(TSAsExpression, TSTypeAssertion) > :matches(FunctionExpression, ArrowFunctionExpression, ObjectExpression, ClassExpression)";

/**
 * Disallow inferred complex return types for arrow functions.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow complex inferred arrow-function return types without explicit annotation.",
    message:
        "Add an explicit return type annotation for complex return expressions.",
    messageId: "forbidden",
    name: "typescript/no-complex-return-type",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-complex-return-type.md",
});

export default rule;
