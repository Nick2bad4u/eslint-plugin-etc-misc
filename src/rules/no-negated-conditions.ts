import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelectors: readonly string[] = [
    'IfStatement > BinaryExpression[operator="!=="]',
    'IfStatement > UnaryExpression[operator="!"]',
    ':not(LogicalExpression) > LogicalExpression[operator="&&"] > BinaryExpression.left[operator="!=="]',
    ':not(LogicalExpression) > LogicalExpression[operator="&&"] > UnaryExpression.left[operator="!"]',
    ':not(LogicalExpression) > LogicalExpression[operator="||"] > BinaryExpression[operator="!=="]',
    ':not(LogicalExpression) > LogicalExpression[operator="||"] > UnaryExpression[operator="!"]',
];

/**
 * Disallow negated conditions in `if` and top-level logical expressions.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
        create: (context) => ({
            [disallowedSelectors.join(", ")]: (node: Readonly<es.Node>): void => {
                context.report({
                    messageId: "forbidden",
                    node,
                });
            },
        }),
        defaultOptions: [],
        meta: {
            docs: {
                description: "disallow negated conditions.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-negated-conditions.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Negated conditions are forbidden.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "no-negated-conditions",
    });

export default rule;
