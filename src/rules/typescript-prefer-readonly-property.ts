import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Require readonly modifiers on class and interface properties.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "require readonly for class and interface properties.",
    message: "Prefer readonly property declarations.",
    messageId: "forbidden",
    name: "typescript/prefer-readonly-property",
    selector:
        ":matches(PropertyDefinition, TSPropertySignature)[readonly!=true]",
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-property",
});

export default rule;
