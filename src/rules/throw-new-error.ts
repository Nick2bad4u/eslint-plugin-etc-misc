import unicornPlugin from "eslint-plugin-unicorn";

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
        unicornPlugin,
        "throw-new-error",
        "eslint-plugin-unicorn"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/throw-new-error.md"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of unicorn/throw-new-error.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "unicorn",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn",
            },
            rule: {
                name: "throw-new-error",
                url: "https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md",
            },
        }),
    ],
    ruleId: "throw-new-error",
});

export default deprecatedRule;
