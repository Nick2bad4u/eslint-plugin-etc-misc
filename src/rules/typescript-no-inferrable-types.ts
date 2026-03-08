import { createSelectorRule } from "../_internal/create-selector-rule";

const selector = [
    "PropertyDefinition[value.type='Literal'] > TSTypeAnnotation",
    "VariableDeclarator[init.type='Literal'] > Identifier.id > TSTypeAnnotation",
].join(", ");

/**
 * Disallow explicit primitive type annotations when they are inferrable.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow explicit primitive type annotations when they are inferrable from literals.",
    message: "Type annotation can be inferred from the assigned literal value.",
    messageId: "forbidden",
    name: "typescript/no-inferrable-types",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-inferrable-types.md",
});

export default rule;
