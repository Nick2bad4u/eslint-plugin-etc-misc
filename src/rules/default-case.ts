import { assertDefined } from "ts-extras";

import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const externalRule = getCoreRule("default-case");

/**
 * Proxy of ESLint core `default-case` with plugin-local docs URL.
 */
const adaptedRule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/default-case"
);
const baseDocs = adaptedRule.meta.docs;
assertDefined(baseDocs);

const rule: typeof adaptedRule = {
    ...adaptedRule,
    meta: {
        ...adaptedRule.meta,
        docs: {
            ...baseDocs,
            recommended: false,
        },
    },
};

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated because this rule directly proxies ESLint core default-case.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "eslint",
                url: "https://eslint.org/docs/latest/rules/",
            },
            rule: {
                name: "default-case",
                url: "https://eslint.org/docs/latest/rules/default-case",
            },
        }),
    ],
    ruleId: "default-case",
});

export default deprecatedRule;
