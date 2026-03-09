import { createImportPatternRule } from "../_internal/create-import-pattern-rule";

/**
 * Disallow importing from ".".
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: ["."],
        description: "disallow imports from the current directory root (.).",
        name: "no-index-import",
    });

export default rule;
