import { createSelectorRule } from "../_internal/create-selector-rule.js";

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
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-template-literal",
});

export default rule;
