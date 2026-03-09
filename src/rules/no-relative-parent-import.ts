import { createImportPatternRule } from "../_internal/create-import-pattern-rule";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation";

/**
 * Disallow relative parent imports like `..` and `../foo`.
 */
const rule: ReturnType<typeof createImportPatternRule> =
    createImportPatternRule({
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

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of import/no-relative-parent-imports.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "import",
                url: "https://github.com/import-js/eslint-plugin-import",
            },
            rule: {
                name: "no-relative-parent-imports",
                url: "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-parent-imports.md",
            },
        }),
    ],
    ruleId: "no-relative-parent-import",
});

export default deprecatedRule;
