import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation";

const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        tsEslintPlugin,
        "no-unnecessary-type-parameters",
        "@typescript-eslint/eslint-plugin"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-useless-generics.md"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of @typescript-eslint/no-unnecessary-type-parameters.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "no-unnecessary-type-parameters",
                url: "https://typescript-eslint.io/rules/no-unnecessary-type-parameters",
            },
        }),
    ],
    ruleId: "no-useless-generics",
});

export default deprecatedRule;
