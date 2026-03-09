import writeGoodCommentsPlugin from "eslint-plugin-write-good-comments";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

/**
 * Proxy of external `write-good-comments/write-good-comments`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        writeGoodCommentsPlugin,
        "write-good-comments",
        "eslint-plugin-write-good-comments"
    ),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/words"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of write-good-comments/write-good-comments.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "write-good-comments",
                url: "https://github.com/kantord/eslint-plugin-write-good-comments",
            },
            rule: {
                name: "write-good-comments",
                url: "https://github.com/kantord/eslint-plugin-write-good-comments",
            },
        }),
    ],
    ruleId: "words",
});

export default deprecatedRule;
