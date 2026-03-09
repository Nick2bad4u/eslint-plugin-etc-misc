import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        tsEslintPlugin,
        "array-type",
        "@typescript-eslint/eslint-plugin"
    ),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/array-type"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @typescript-eslint/array-type.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "array-type",
                url: "https://typescript-eslint.io/rules/array-type",
            },
        }),
    ],
    ruleId: "array-type",
});

export default deprecatedRule;
