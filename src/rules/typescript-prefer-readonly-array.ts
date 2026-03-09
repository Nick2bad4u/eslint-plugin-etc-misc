import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector = [
    ":not(TSTypeOperator[operator='readonly']) > :matches(TSArrayType, TSTupleType)",
    "TSTypeReference > Identifier[name='Array']",
].join(", ");

/**
 * Require readonly array and tuple type annotations.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require readonly array and tuple type annotations.",
    message: "Prefer readonly array or tuple types.",
    messageId: "forbidden",
    name: "typescript/prefer-readonly-array",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-prefer-readonly-array.md",
});

export default rule;
