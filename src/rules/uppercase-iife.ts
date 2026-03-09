import unicornPlugin from "eslint-plugin-unicorn";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

/**
 * Proxy of external `unicorn/no-unreadable-iife`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        unicornPlugin,
        "no-unreadable-iife",
        "eslint-plugin-unicorn"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/uppercase-iife.md"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of unicorn/no-unreadable-iife.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "unicorn",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn",
            },
            rule: {
                name: "no-unreadable-iife",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-iife.md",
            },
        }),
    ],
    ruleId: "uppercase-iife",
});

export default deprecatedRule;
