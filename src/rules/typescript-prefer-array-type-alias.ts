import { createSelectorRule } from "../_internal/create-selector-rule";

const selector =
    String.raw`TSTypeAliasDeclaration > Identifier.id:matches([parent.typeAnnotation.type='TSArrayType'], [parent.typeAnnotation.type='TSTupleType']):not([name=/^(?:[A-Z][a-z\d]*)+(?:Array|s)$/u])`;

/**
 * Prefer reusable named aliases for array and tuple type aliases.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "prefer reusable alias names for array and tuple type aliases.",
    message:
        'Prefer a named alias ending in "Array" or "s" for array/tuple type aliases.',
    messageId: "forbidden",
    name: "typescript/prefer-array-type-alias",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-prefer-array-type-alias.md",
});

export default rule;
