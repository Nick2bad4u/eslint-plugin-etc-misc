import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

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
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [arrayJoin(disallowedSelectors, ", ")]: (node: Readonly<es.Node>): void => {
            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow negated conditions.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-negated-conditions",
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
