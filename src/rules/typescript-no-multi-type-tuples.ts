import { createSelectorRule } from "../_internal/create-selector-rule";

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
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-multi-type-tuples.md",
});

export default rule;
