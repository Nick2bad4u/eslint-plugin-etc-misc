import { createImportPatternRule } from "../_internal/create-import-pattern-rule";

/**
 * Disallow relative parent imports like `..` and `../foo`.
 */
const rule: ReturnType<typeof createImportPatternRule> = createImportPatternRule({
    defaultDisallowPatterns: [
        "..",
        "../**",
        "../..",
        "../../**",
        "../../..",
        "../../../**",
        "../../../..",
        "../../../../**",
        "../../../../..",
        "../../../../../**",
    ],
    description: "disallow relative parent imports.",
    name: "no-relative-parent-import",
});

export default rule;
