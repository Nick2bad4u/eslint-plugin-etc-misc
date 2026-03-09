/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESLint fixer API callback signatures. */

import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "incorrectSorting";

type Options = readonly [];

const commentText = (comment: Readonly<es.Comment>): string =>
    comment.value.trim();

const buildReplacement = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    comments: readonly es.Comment[]
): string =>
    comments
        .map((comment) => sourceCode.getText(comment))
        // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
        .sort((a, b) => a.localeCompare(b))
        .join("\n");

/**
 * Enforce alphabetical ordering of top-of-file comments.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        Program: (node: Readonly<es.Program>): void => {
            const firstNode = node.body[0];
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
                        [
                            comments[0].range[0],
                            // eslint-disable-next-line unicorn/prefer-at -- Node >=16.0 support baseline
                            comments[comments.length - 1]?.range[1] ??
                                comments[0].range[1],
                        ],
                        buildReplacement(context.sourceCode, comments)
                    ),
                messageId: "incorrectSorting",
                node: comments[0],
            });
        },
    }),
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "enforce alphabetical ordering of top-of-file comments.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/sort-top-comments.md",
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
