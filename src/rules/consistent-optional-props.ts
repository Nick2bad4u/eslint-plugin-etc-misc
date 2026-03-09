import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector = [
    "TSPropertySignature[optional=true] > TSTypeAnnotation > TSUnionType > TSUndefinedKeyword",
    "PropertyDefinition[optional=true] > TSTypeAnnotation > TSUnionType > TSUndefinedKeyword",
].join(", ");

/**
 * Disallow redundant `undefined` unions on already-optional properties.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow redundant `undefined` unions on optional property declarations.",
    message:
        "Optional properties should not redundantly include `undefined` in their type union.",
    messageId: "forbidden",
    name: "consistent-optional-props",
    selector,
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-optional-props",
});

export default rule;
