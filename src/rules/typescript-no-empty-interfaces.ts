import { createSelectorRule } from "../_internal/create-selector-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

/**
 * Disallow empty interfaces without extends clauses.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description: "disallow empty interfaces without extends clauses.",
    message: "Empty interface is not allowed.",
    messageId: "forbidden",
    name: "typescript/no-empty-interfaces",
    selector:
        "TSInterfaceDeclaration[body.body.length=0][extends.length=0] > Identifier.id",
    type: "problem",
    url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/typescript-no-empty-interfaces.md",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @typescript-eslint/no-empty-object-type.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "no-empty-object-type",
                url: "https://typescript-eslint.io/rules/no-empty-object-type",
            },
        }),
    ],
    ruleId: "typescript/no-empty-interfaces",
});

export default deprecatedRule;
