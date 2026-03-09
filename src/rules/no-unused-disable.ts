import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

/**
 * Proxy of external `@eslint-community/eslint-comments/no-unused-disable`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        eslintCommentsPlugin,
        "no-unused-disable",
        "@eslint-community/eslint-plugin-eslint-comments"
    ),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unused-disable"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of @eslint-community/eslint-comments/no-unused-disable.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@eslint-community/eslint-comments",
                url: "https://eslint-community.github.io/eslint-plugin-eslint-comments/",
            },
            rule: {
                name: "no-unused-disable",
                url: "https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/no-unused-disable.html",
            },
        }),
    ],
    ruleId: "no-unused-disable",
});

export default deprecatedRule;
