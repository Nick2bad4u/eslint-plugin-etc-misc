import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const externalRule = getCoreRule("prefer-object-has-own");

const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-object-has-own"
);

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of ESLint core prefer-object-has-own.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "eslint",
                url: "https://eslint.org/docs/latest/rules/",
            },
            rule: {
                name: "prefer-object-has-own",
                url: "https://eslint.org/docs/latest/rules/prefer-object-has-own",
            },
        }),
    ],
    ruleId: "prefer-object-has-own",
});

export default deprecatedRule;
