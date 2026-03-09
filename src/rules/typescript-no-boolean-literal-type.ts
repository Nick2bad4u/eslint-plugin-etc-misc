import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector = [
    "TSPropertySignature[optional=true] > TSTypeAnnotation > TSLiteralType > Literal[value=true]",
    "TSPropertySignature[optional=true] > TSTypeAnnotation > TSLiteralType > Literal[value=false]",
].join(", ");

/**
 * Disallow optional boolean literal property types.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow optional boolean literal types in property signatures.",
    message: 'Use "boolean" type instead.',
    messageId: "forbidden",
    name: "typescript/no-boolean-literal-type",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-boolean-literal-type.md",
});

export default rule;
