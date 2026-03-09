import { createSelectorRule } from "../_internal/create-selector-rule.js";

/**
 * Require explicit type annotations for uninitialized class properties.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "require explicit type annotations for class properties without initializers.",
    message: "Expecting a type annotation for this property.",
    messageId: "forbidden",
    name: "typescript/require-prop-type-annotation",
    selector: "PropertyDefinition[typeAnnotation=undefined][value=null]",
    type: "problem",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-prop-type-annotation",
});

export default rule;
