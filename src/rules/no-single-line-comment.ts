import type { TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestConvertToBlock";

type Options = readonly [
    Readonly<{
        readonly allowDirectiveComments?: boolean;
    }>?,
];

const directiveCommentPattern =
    /^(?:eslint(?:-|$)|global\s|exported\s|ts-(?:check|expect-error|ignore|nocheck))/u;

const isDirectiveComment = (commentText: string): boolean =>
    directiveCommentPattern.test(commentText.trimStart());

const createConvertToBlockSuggestionFix = (
    commentValue: string,
    commentRange: readonly [number, number]
): TSESLint.ReportFixFunction | undefined => {
    if (commentValue.includes("*/")) {
        return undefined;
    }

    return (fixer) =>
        fixer.replaceTextRange(commentRange, `/*${commentValue} */`);
};

/**
 * Disallow single-line comments except optionally allowed directive comments.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const [{ allowDirectiveComments = true } = {}] = context.options;

        return {
            Program: () => {
                for (const comment of context.sourceCode.getAllComments()) {
                    if (comment.type !== "Line") {
                        continue;
                    }

                    if (
                        allowDirectiveComments &&
                        isDirectiveComment(comment.value)
                    ) {
                        continue;
                    }

                    const isDirective = isDirectiveComment(comment.value);
                    const suggestionFix = isDirective
                        ? undefined
                        : createConvertToBlockSuggestionFix(
                              comment.value,
                              comment.range
                          );

                    context.report({
                        ...(suggestionFix === undefined
                            ? {}
                            : {
                                  fix: suggestionFix,
                              }),
                        loc: comment.loc,
                        messageId: "forbidden",
                        ...(suggestionFix === undefined
                            ? {}
                            : {
                                  suggest: [
                                      {
                                          fix: suggestionFix,
                                          messageId: "suggestConvertToBlock",
                                      },
                                  ],
                              }),
                    });
                }
            },
        };
    },
    defaultOptions: [{ allowDirectiveComments: true }],
    meta: {
        defaultOptions: [{ allowDirectiveComments: true }],
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow single-line comments.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-single-line-comment",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Single-line comments are not allowed; use block comments instead.",
            suggestConvertToBlock:
                "Convert this single-line comment to a block comment.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for allowing directive line comments.",
                properties: {
                    allowDirectiveComments: {
                        description:
                            "Whether to allow line comments used as lint/compiler directives.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "suggestion",
    },
    name: "no-single-line-comment",
});

export default rule;
