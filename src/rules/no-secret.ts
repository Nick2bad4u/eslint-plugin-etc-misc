import noSecretsPlugin from "eslint-plugin-no-secrets";

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
        noSecretsPlugin,
        "no-secrets",
        "eslint-plugin-no-secrets"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-secret.md"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of dedicated secret scanning tools such as Secretlint and detect-secrets.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "secretlint",
                url: "https://github.com/secretlint/secretlint",
            },
        }),
        createReplacementRuleInfo({
            plugin: {
                name: "detect-secrets",
                url: "https://github.com/Yelp/detect-secrets",
            },
        }),
        createReplacementRuleInfo({
            plugin: {
                name: "no-secrets",
                url: "https://github.com/nickdeis/eslint-plugin-no-secrets",
            },
            rule: {
                name: "no-secrets/no-secrets",
                url: "https://github.com/nickdeis/eslint-plugin-no-secrets",
            },
        }),
    ],
    ruleId: "no-secret",
});

export default deprecatedRule;
