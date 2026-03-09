import { createImportPatternRule } from "../_internal/create-import-pattern-rule.js";

/**
 * Disallow importing nested internal module paths.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: [
            "./*/**",
            "[^@]*/**",
            "@?*/*/**",
        ],
        description: "disallow importing internal modules.",
        name: "no-internal-modules",
    });

export default rule;
