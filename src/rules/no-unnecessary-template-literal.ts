import { createSelectorRule } from "../_internal/create-selector-rule";

const selector = "TemplateLiteral[expressions.length=0] > TemplateElement";

/**
 * Disallow template literals with no expressions.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow template literals that have no interpolated expressions.",
    message:
        "Use a string literal instead of an expression-free template literal.",
    messageId: "forbidden",
    name: "no-unnecessary-template-literal",
    selector,
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-unnecessary-template-literal.md",
});

export default rule;
