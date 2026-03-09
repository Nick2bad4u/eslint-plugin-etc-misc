import { createImportPatternRule } from "../_internal/create-import-pattern-rule.js";

/**
 * Disallow importing Node.js built-in modules via the `node:` protocol.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
        defaultDisallowPatterns: ["node:*"],
        description: "disallow imports from node: built-in module specifiers.",
        name: "no-nodejs-modules",
    });

export default rule;
