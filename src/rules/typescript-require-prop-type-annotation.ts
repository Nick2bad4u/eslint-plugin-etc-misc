import { createSelectorRule } from "../_internal/create-selector-rule";

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
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-require-prop-type-annotation.md",
});

export default rule;
