import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector =
    "VariableDeclarator:not([id.typeAnnotation], [init.expression.properties.length=0]) > Identifier.id";

/**
 * Disallow complex inferred declarator types without annotation.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow complex inferred declarator types without explicit annotation.",
    message:
        "Add a type annotation (or `as const`) for this complex declarator.",
    messageId: "forbidden",
    name: "typescript/no-complex-declarator-type",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-complex-declarator-type.md",
});

export default rule;
