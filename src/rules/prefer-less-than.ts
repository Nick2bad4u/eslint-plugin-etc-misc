import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, setHas } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds =
    | "forbiddenGT"
    | "forbiddenGTE"
    | "suggestLT"
    | "suggestLTE";

const relationalOperators = new Set<es.BinaryExpression["operator"]>([
    "<",
    "<=",
    ">",
    ">=",
    "in",
    "instanceof",
]);

const needsGroupingOnRight = (
    operand: Readonly<es.BinaryExpression["left"]>
): boolean =>
    (operand.type === AST_NODE_TYPES.BinaryExpression &&
        setHas(relationalOperators, operand.operator)) ||
    operand.type === AST_NODE_TYPES.TSAsExpression ||
    operand.type === AST_NODE_TYPES.TSSatisfiesExpression;

const needsGroupingOnLeft = (operand: Readonly<es.Expression>): boolean =>
    operand.type === AST_NODE_TYPES.ClassExpression ||
    operand.type === AST_NODE_TYPES.FunctionExpression ||
    operand.type === AST_NODE_TYPES.ObjectExpression;

const createFixes = (
    fixer: Readonly<TSESLint.RuleFixer>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    expression: Readonly<es.BinaryExpression>,
    operatorText: "<" | "<="
): null | readonly TSESLint.RuleFix[] => {
    const { left, right } = expression;
    const operatorToken = sourceCode.getFirstTokenBetween(left, right, {
        filter: (token) => token.value === expression.operator,
    });
    if (operatorToken === null) {
        return null;
    }

    const leftEnd = sourceCode.getTokenBefore(operatorToken);
    const rightStart = sourceCode.getTokenAfter(operatorToken);
    if (leftEnd === null || rightStart === null) {
        return null;
    }

    const leftRange: [number, number] = [
        arrayFirst(expression.range),
        leftEnd.range[1],
    ];
    const rightRange: [number, number] = [
        arrayFirst(rightStart.range),
        expression.range[1],
    ];
    const leftText = sourceCode.text.slice(...leftRange);
    const rightText = sourceCode.text.slice(...rightRange);
    const movedLeftText =
        arrayFirst(leftRange) === arrayFirst(left.range) &&
        needsGroupingOnRight(left)
            ? `(${leftText})`
            : leftText;
    const movedRightText =
        arrayFirst(rightRange) === arrayFirst(right.range) &&
        needsGroupingOnLeft(right)
            ? `(${rightText})`
            : rightText;

    return [
        fixer.replaceTextRange(leftRange, movedRightText),
        fixer.replaceTextRange(operatorToken.range, operatorText),
        fixer.replaceTextRange(rightRange, movedLeftText),
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
                        createFixes(
                            fixer,
                            context.sourceCode,
                            expression,
                            fixOperator
                        ),
                    messageId,
                    node: expression,
                    suggest: [
                        {
                            fix: (fixer) =>
                                createFixes(
                                    fixer,
                                    context.sourceCode,
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
            languages: ["js/js"],
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
