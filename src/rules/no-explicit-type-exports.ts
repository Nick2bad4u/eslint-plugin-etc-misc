import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const adaptedRule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        tsEslintPlugin,
        "consistent-type-exports",
        "@typescript-eslint/eslint-plugin"
    ),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-explicit-type-exports"
);

/** Preserve the historical rule ID while delegating to typescript-eslint. */
const rule: typeof adaptedRule = withDeprecatedRuleLifecycle(adaptedRule, {
    deprecatedSince: "1.3.0",
    message:
        "Deprecated compatibility adapter. Use @typescript-eslint/consistent-type-exports directly.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "consistent-type-exports",
                url: "https://typescript-eslint.io/rules/consistent-type-exports",
            },
        }),
    ],
    ruleId: "no-explicit-type-exports",
});

export default rule;
