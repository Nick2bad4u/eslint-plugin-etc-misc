/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESLint fixer API callback signatures. */

import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayFirst, arrayJoin, arrayLast } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "incorrectSorting";

type Options = readonly [];

const commentText = (comment: Readonly<es.Comment>): string =>
    comment.value.trim();

const buildReplacement = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    comments: readonly es.Comment[]
): string =>
    arrayJoin(
        comments
            .map((comment) => sourceCode.getText(comment))
            // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
            .sort((a, b) => a.localeCompare(b)),
        "\n"
    );

/**
 * Enforce alphabetical ordering of top-of-file comments.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        Program: (node: Readonly<es.Program>): void => {
            const firstNode = arrayFirst(node.body);
            if (firstNode === undefined) {
                return;
            }

            const comments = context.sourceCode
                .getCommentsBefore(firstNode)
                .filter(
                    (comment) => comment.loc.end.line < firstNode.loc.start.line
                );
            if (comments.length < 2) {
                return;
            }

            const firstComment = arrayFirst(comments);
            if (firstComment === undefined) {
                return;
            }

            const lastComment = arrayLast(comments) ?? firstComment;

            // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
            const sorted = [...comments].sort((a, b) =>
                commentText(a).localeCompare(commentText(b))
            );
            const isSorted = comments.every(
                (comment, index) => comment === sorted[index]
            );
            if (isSorted) {
                return;
            }

            context.report({
                fix: (fixer): TSESLint.RuleFix =>
                    fixer.replaceTextRange(
                        [arrayFirst(firstComment.range), lastComment.range[1]],
                        buildReplacement(context.sourceCode, comments)
                    ),
                messageId: "incorrectSorting",
                node: firstComment,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce alphabetical ordering of top-of-file comments.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-top-comments",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            incorrectSorting:
                "Top-level comments should be sorted alphabetically.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-top-comments",
});

export default rule;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after file-scoped fixer callback implementations. */
