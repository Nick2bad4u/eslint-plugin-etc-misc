import { assertDefined } from "ts-extras";

import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";
import deprecatedRule from "./no-restricted-syntax.js";

const noRestrictedSyntaxRule: typeof deprecatedRule = deprecatedRule;
const baseDocs = noRestrictedSyntaxRule.meta.docs;
assertDefined(baseDocs);

/**
 * TypeScript-prefixed alias for selector-based restricted syntax checks.
 */
const typescriptNoRestrictedSyntaxRule: typeof noRestrictedSyntaxRule = {
    ...noRestrictedSyntaxRule,
    meta: {
        deprecated: true,
        ...noRestrictedSyntaxRule.meta,
        docs: {
            ...baseDocs,
            deprecated: true,
            frozen: true,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-restricted-syntax",
        },
    },
};

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const rule: typeof typescriptNoRestrictedSyntaxRule =
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

export default rule;
