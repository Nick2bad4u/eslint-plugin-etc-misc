import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector = String.raw`TSEnumMember:not([id.name=/^[A-Z][A-Z_\d]*$/u], [initializer.value=/^[A-Z][A-Z_\d]*$/u])`;

/**
 * Enforce SCREAMING_SNAKE_CASE enum member names and literal values.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "enforce SCREAMING_SNAKE_CASE enum member names and string literal values.",
    message:
        "Enum member names and string values must use SCREAMING_SNAKE_CASE.",
    messageId: "forbidden",
    name: "consistent-enum-members",
    selector,
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-enum-members",
});

export default rule;
