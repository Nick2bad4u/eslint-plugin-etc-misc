import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const externalRule = getCoreRule("prefer-object-has-own");

const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-object-has-own.md"
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
