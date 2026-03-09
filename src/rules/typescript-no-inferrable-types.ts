import { createSelectorRule } from "../_internal/create-selector-rule.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

const selector = [
    "PropertyDefinition[value.type='Literal'] > TSTypeAnnotation",
    "VariableDeclarator[init.type='Literal'] > Identifier.id > TSTypeAnnotation",
].join(", ");

/**
 * Disallow explicit primitive type annotations when they are inferrable.
 */
const rule: ReturnType<typeof createSelectorRule> = createSelectorRule({
    description:
        "disallow explicit primitive type annotations when they are inferrable from literals.",
    message: "Type annotation can be inferred from the assigned literal value.",
    messageId: "forbidden",
    name: "typescript/no-inferrable-types",
    selector,
    type: "suggestion",
    url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-inferrable-types",
});

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message: "Deprecated in favor of @typescript-eslint/no-inferrable-types.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "no-inferrable-types",
                url: "https://typescript-eslint.io/rules/no-inferrable-types",
            },
        }),
    ],
    ruleId: "typescript/no-inferrable-types",
});

export default deprecatedRule;
