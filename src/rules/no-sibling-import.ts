import { createImportPatternRule } from "../_internal/create-import-pattern-rule.js";

/**
 * Disallow sibling-file imports from the current directory.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: ["./*"],
        description: "disallow sibling imports from the current directory.",
        name: "no-sibling-import",
    });

export default rule;
