import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [
    Readonly<{
        allowDirectiveComments?: boolean;
    }>?,
];

const directiveCommentPattern =
    /^(?:eslint(?:-|$)|global\s|exported\s|ts-(?:check|expect-error|ignore|nocheck))/u;

const isDirectiveComment = (commentText: string): boolean =>
    directiveCommentPattern.test(commentText.trimStart());

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

                    context.report({
                        loc: comment.loc,
                        messageId: "forbidden",
                    });
                }
            },
        };
    },
    defaultOptions: [{ allowDirectiveComments: true }],
    meta: {
        defaultOptions: [{ allowDirectiveComments: true }],
        docs: {
            description: "disallow single-line comments.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-single-line-comment",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Single-line comments are not allowed; use block comments instead.",
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
