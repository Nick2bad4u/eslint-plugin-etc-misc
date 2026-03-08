import { createSelectorRule } from "../_internal/create-selector-rule";

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
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-prefer-readonly-property.md",
});

export default rule;
