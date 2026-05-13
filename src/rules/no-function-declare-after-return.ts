import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, arrayLast } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

/**
 * Returns true if the given node is a `BlockStatement` or a `Program` — i.e., a
 * node that has a `body` array of `Statement` nodes.
 */
const isStatementList = (
    node: Readonly<es.Node>
): node is es.BlockStatement | es.Program =>
    node.type === AST_NODE_TYPES.BlockStatement ||
    node.type === AST_NODE_TYPES.Program;

const getLineStartIndex = (sourceText: string, index: number): number =>
    sourceText.lastIndexOf("\n", index - 1) + 1;

const getSafeFixRangeStart = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.FunctionDeclaration>
): number => {
    const declarationStart = arrayFirst(node.range);
    const tokenBeforeDeclaration = sourceCode.getTokenBefore(node);
    const tokenBeforeEnd =
        tokenBeforeDeclaration === null
            ? 0
            : arrayLast(tokenBeforeDeclaration.range);

    const commentsBeforeDeclaration = sourceCode
        .getCommentsBefore(node)
        .filter(
            (comment) =>
                arrayFirst(comment.range) >= tokenBeforeEnd &&
                arrayLast(comment.range) <= declarationStart
        );

    const firstLeadingComment = arrayFirst(commentsBeforeDeclaration);
    const firstMovableNodeStart =
        firstLeadingComment === undefined
            ? declarationStart
            : arrayFirst(firstLeadingComment.range);

    return getLineStartIndex(sourceCode.text, firstMovableNodeStart);
};

const getSafeFixRangeEnd = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.FunctionDeclaration>
): number => {
    const declarationEnd = arrayLast(node.range);
    const tokenAfterDeclaration = sourceCode.getTokenAfter(node);

    if (tokenAfterDeclaration === null) {
        return declarationEnd;
    }

    return getLineStartIndex(
        sourceCode.text,
        arrayFirst(tokenAfterDeclaration.range)
    );
};

/**
 * Disallow function declarations that appear after a `return` statement in the
 * same block scope.
 *
 * JavaScript hoists function declarations to the top of their enclosing scope,
 * so placing a function declaration after a `return` works at runtime. However,
 * it hurts readability and confuses readers who are not aware of hoisting.
 *
 * Only `FunctionDeclaration` nodes are targeted. Arrow-function expressions,
 * function expressions assigned to variables, and any code that is genuinely
 * unreachable are not in scope for this rule — `no-unreachable` already covers
 * that case.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        ReturnStatement(node: Readonly<es.ReturnStatement>): void {
            const parent = node.parent;

            // Only check return statements that live directly inside a block
            // (`BlockStatement`) or at the top level of a script/module
            // (`Program`). Return statements inside a `SwitchCase` consequent
            // do not have a traditional `body` array, so skip them.
            if (!isStatementList(parent)) {
                return;
            }

            const siblings = parent.body;
            const returnIndex = siblings.indexOf(node);

            // Scan every statement that follows this return in the same block.
            for (let i = returnIndex + 1; i < siblings.length; i++) {
                const sibling = siblings[i];

                if (sibling?.type !== AST_NODE_TYPES.FunctionDeclaration) {
                    continue;
                }

                // Capture in closure for the fix function.
                const functionDeclaration = sibling;
                const returnStatement = node;

                context.report({
                    data: {
                        name: functionDeclaration.id.name,
                    },
                    fix(fixer) {
                        const sourceCode = context.sourceCode;

                        // Text of the function declaration to move.
                        const declarationEnd = arrayLast(
                            functionDeclaration.range
                        );
                        const fixRangeStart = getSafeFixRangeStart(
                            sourceCode,
                            functionDeclaration
                        );
                        const fixRangeEnd = getSafeFixRangeEnd(
                            sourceCode,
                            functionDeclaration
                        );
                        const functionAndLeadingCommentsText =
                            sourceCode.text.slice(
                                fixRangeStart,
                                declarationEnd
                            );

                        if (
                            functionAndLeadingCommentsText.trim().length === 0
                        ) {
                            return null;
                        }

                        // We want to insert before the return statement.
                        // Determine the correct indentation by looking at the
                        // token that starts the return statement.
                        const returnToken =
                            sourceCode.getFirstToken(returnStatement);
                        if (returnToken === null) {
                            return null;
                        }
                        const indentationEnd = arrayFirst(returnToken.range);
                        const returnLineStart = getLineStartIndex(
                            sourceCode.text,
                            indentationEnd
                        );

                        return [
                            fixer.insertTextBeforeRange(
                                [returnLineStart, returnLineStart],
                                `${functionAndLeadingCommentsText}\n`
                            ),
                            fixer.removeRange([fixRangeStart, fixRangeEnd]),
                        ];
                    },
                    messageId: "forbidden",
                    node: functionDeclaration,
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow function declarations after a return statement.",
            frozen: false,
            recommended: true,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-function-declare-after-return",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden:
                "Function declaration '{{name}}' should be moved before the return statement for readability.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-function-declare-after-return",
});

export default rule;
