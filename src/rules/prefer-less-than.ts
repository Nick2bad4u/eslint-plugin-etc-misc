import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds =
    | "forbiddenGT"
    | "forbiddenGTE"
    | "suggestLT"
    | "suggestLTE";

const createFixes = (
    fixer: Readonly<TSESLint.RuleFixer>,
    context: Readonly<TSESLint.RuleContext<MessageIds, readonly []>>,
    expression: Readonly<es.BinaryExpression>,
    operatorText: "<" | "<="
): readonly TSESLint.RuleFix[] => {
    const { left, right } = expression;
    const operatorToken = context.sourceCode.getTokenAfter(left);
    if (operatorToken === null) {
        return [];
    }

    return [
        fixer.replaceText(left, context.sourceCode.getText(right)),
        fixer.replaceTextRange(operatorToken.range, operatorText),
        fixer.replaceText(right, context.sourceCode.getText(left)),
    ];
};

/**
 * Disallow greater-than comparisons in favor of less-than comparisons.
 */
const rule: ReturnType<typeof ruleCreator<readonly [], MessageIds>> =
    ruleCreator<readonly [], MessageIds>({
        create: (context) => ({
            "BinaryExpression[operator='>'], BinaryExpression[operator='>=']": (
                expression: Readonly<es.BinaryExpression>
            ) => {
                const useLessThanOrEqual = expression.operator === ">=";
                const fixOperator = useLessThanOrEqual ? "<=" : "<";
                const messageId = useLessThanOrEqual
                    ? "forbiddenGTE"
                    : "forbiddenGT";
                const suggestionMessageId = useLessThanOrEqual
                    ? "suggestLTE"
                    : "suggestLT";

                context.report({
                    fix: (fixer) =>
                        createFixes(fixer, context, expression, fixOperator),
                    messageId,
                    node: expression,
                    suggest: [
                        {
                            fix: (fixer) =>
                                createFixes(
                                    fixer,
                                    context,
                                    expression,
                                    fixOperator
                                ),
                            messageId: suggestionMessageId,
                        },
                    ],
                });
            },
        }),
        meta: {
            deprecated: false,
            docs: {
                deprecated: false,
                description: "disallow greater-than comparisons.",
                frozen: false,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-less-than",
            },
            fixable: "code",
            hasSuggestions: true,
            messages: {
                forbiddenGT: "Greater-than comparisons are forbidden.",
                forbiddenGTE:
                    "Greater-than-or-equal comparisons are forbidden.",
                suggestLT: "Use a less-than comparison instead.",
                suggestLTE: "Use a less-than-or-equal comparison instead.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "prefer-less-than",
    });

export default rule;
