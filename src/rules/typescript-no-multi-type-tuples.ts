import { createSelectorRule } from "../_internal/create-selector-rule.js";

const selector = "TSTupleType > TSUnionType:not([types.length=1])";

/**
 * Disallow union element types directly inside tuple elements.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow union element types directly inside tuple element positions.",
    message: "Avoid multi-type tuple elements; extract a named alias instead.",
    messageId: "forbidden",
    name: "typescript/no-multi-type-tuples",
    selector,
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-multi-type-tuples",
});

export default rule;
