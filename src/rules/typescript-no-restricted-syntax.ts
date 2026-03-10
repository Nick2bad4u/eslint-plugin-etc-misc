import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";
import noRestrictedSyntaxRule from "./no-restricted-syntax.js";

/**
 * TypeScript-prefixed alias for selector-based restricted syntax checks.
 */
const typescriptNoRestrictedSyntaxRule: typeof noRestrictedSyntaxRule = {
    ...noRestrictedSyntaxRule,
    meta: {
        deprecated: true,
        ...noRestrictedSyntaxRule.meta,
        docs: {
            deprecated: true,
            frozen: true,
            recommended: false,
            ...noRestrictedSyntaxRule.meta.docs,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-restricted-syntax",
        } as NonNullable<typeof noRestrictedSyntaxRule.meta.docs>,
    },
};

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof typescriptNoRestrictedSyntaxRule =
    withDeprecatedRuleLifecycle(typescriptNoRestrictedSyntaxRule, {
        message:
            "Deprecated in favor of @typescript-eslint/no-restricted-syntax.",
        replacedBy: [
            createReplacementRuleInfo({
                plugin: {
                    name: "@typescript-eslint",
                    url: "https://typescript-eslint.io/",
                },
                rule: {
                    name: "no-restricted-syntax",
                    url: "https://typescript-eslint.io/rules/no-restricted-syntax",
                },
            }),
        ],
        ruleId: "typescript/no-restricted-syntax",
    });

export default deprecatedRule;
