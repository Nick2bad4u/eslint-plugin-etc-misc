import { createSelectorRule } from "../_internal/create-selector-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const selector =
    "SwitchStatement[cases.length>1]:not(:has(SwitchCase[test=null]))";

/**
 * Require a default case in non-trivial switch statements.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "require a default case in switch statements with multiple branches.",
    message: "Add a default case to make this switch exhaustive.",
    messageId: "forbidden",
    name: "typescript/exhaustive-switch",
    selector,
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-exhaustive-switch",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of @typescript-eslint/switch-exhaustiveness-check.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "switch-exhaustiveness-check",
                url: "https://typescript-eslint.io/rules/switch-exhaustiveness-check",
            },
        }),
    ],
    ruleId: "typescript/exhaustive-switch",
});

export default deprecatedRule;
