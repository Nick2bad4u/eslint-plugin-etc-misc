import { createImportPatternRule } from "../_internal/create-import-pattern-rule";

/**
 * Disallow import and export sources by configured glob patterns.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: [],
        description:
            "disallow import sources using configurable glob patterns.",
        name: "disallow-import",
    });

export default rule;
