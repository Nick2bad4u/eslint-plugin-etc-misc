import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_TOKEN_TYPES } from "@typescript-eslint/utils";
import { arrayFirst } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "invalidSpacing";

type Options = readonly [];

const isEslintDirectiveComment = (comment: Readonly<es.Comment>): boolean =>
    comment.type === AST_TOKEN_TYPES.Block &&
    comment.value.trimStart().startsWith("eslint-");

const expectedBlankLines = (comment: Readonly<es.Comment>): 0 | 1 => {
    if (
        comment.type === AST_TOKEN_TYPES.Line ||
        isEslintDirectiveComment(comment)
    ) {
        return 0;
    }

    return /\r\n|\n/v.test(comment.value) ? 1 : 0;
};

const buildFix =
    (
        sourceCode: Readonly<TSESLint.SourceCode>,
        comment: Readonly<es.Comment>,
        nextNode: Readonly<es.Node | es.Token>,
        expected: number
    ): TSESLint.ReportFixFunction =>
    (fixer): TSESLint.RuleFix => {
        const textBetween = sourceCode.text.slice(
            comment.range[1],
            arrayFirst(nextNode.range)
        );
        const lineEnding = textBetween.includes("\r\n") ? "\r\n" : "\n";
        const indentation = " ".repeat(nextNode.loc.start.column);

        return fixer.replaceTextRange(
            [comment.range[1], arrayFirst(nextNode.range)],
            `${lineEnding.repeat(expected + 1)}${indentation}`
        );
    };

/**
 * Enforce consistent blank-line spacing after comments.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        Program: (): void => {
            const comments = context.sourceCode.getAllComments();

            for (const comment of comments) {
                const nextNode = context.sourceCode.getTokenAfter(comment, {
                    includeComments: false,
                });
                if (nextNode === null) {
                    continue;
                }

                const blankLines =
                    nextNode.loc.start.line - comment.loc.end.line - 1;
                const expected = expectedBlankLines(comment);
                if (blankLines === expected) {
                    continue;
                }

                context.report({
                    fix: buildFix(
                        context.sourceCode,
                        comment,
                        nextNode,
                        expected
                    ),
                    messageId: "invalidSpacing",
                    node: comment,
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce consistent blank-line spacing after comments.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/comment-spacing",
        },
        fixable: "whitespace",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            invalidSpacing: "Incorrect blank-line spacing after this comment.",
        },
        schema: [],
        type: "layout",
    },
    name: "comment-spacing",
});

export default rule;
