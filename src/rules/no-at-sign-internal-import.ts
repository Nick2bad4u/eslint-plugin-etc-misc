import { createImportPatternRule } from "../_internal/create-import-pattern-rule.js";

/**
 * Disallow importing internal module paths under `@/`.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: ["@/**"],
        description: "disallow internal imports under @/.",
        name: "no-at-sign-internal-import",
    });

export default rule;
