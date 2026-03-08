import { createSelectorRule } from "../_internal/create-selector-rule";

/**
 * Disallow additional exports when a default export exists.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "disallow additional exports alongside a default export.",
    message: "Export default should be only export.",
    messageId: "forbidden",
    name: "prefer-only-export",
    selector: "Program[body.length>1]:has(ExportDefaultDeclaration)",
    type: "suggestion",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-only-export.md",
});

export default rule;
