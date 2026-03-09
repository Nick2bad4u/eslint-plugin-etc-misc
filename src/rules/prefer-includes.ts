import unicornPlugin from "eslint-plugin-unicorn";

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
        unicornPlugin,
        "prefer-includes",
        "eslint-plugin-unicorn"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-includes.md"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of unicorn/prefer-includes.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "unicorn",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn",
            },
            rule: {
                name: "prefer-includes",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md",
            },
        }),
    ],
    ruleId: "prefer-includes",
});

export default deprecatedRule;
