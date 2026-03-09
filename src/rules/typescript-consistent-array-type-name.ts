import { createSelectorRule } from "../_internal/create-selector-rule";

const selector = String.raw`:matches(TSTypeAliasDeclaration[typeAnnotation.type='TSArrayType'], TSTypeAliasDeclaration[typeAnnotation.type='TSTupleType'], TSTypeAliasDeclaration[typeAnnotation.type='TSTypeReference']:has(TSTypeReference > Identifier[name='Array'])) > Identifier.id:not([name=/^(?:[A-Z][a-z\d]*)+(?:Array|s)$/u])`;

/**
 * Require array-like type aliases to end with `Array` or `s`.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "enforce consistent naming for array-like type aliases.",
    message:
        'Use a name ending with "Array" or "s" for array-like type aliases.',
    messageId: "forbidden",
    name: "typescript/consistent-array-type-name",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-consistent-array-type-name.md",
});

export default rule;
