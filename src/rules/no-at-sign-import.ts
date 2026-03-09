import { createImportPatternRule } from "../_internal/create-import-pattern-rule";

/**
 * Disallow importing exactly from `@`.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: ["@"],
        description: "disallow imports from @.",
        name: "no-at-sign-import",
    });

export default rule;
