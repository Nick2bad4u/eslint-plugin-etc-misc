import type { TSESTree as es } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { arrayFirst, arrayJoin, isDefined, stringSplit } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type CommentBlock = Readonly<{
    readonly content: string;
    readonly loc: es.SourceLocation;
}>;

type MessageIds = "forbidden";

const parserOptions: Readonly<{
    readonly ecmaVersion: "latest";
    readonly sourceType: "module";
}> = {
    ecmaVersion: "latest",
    sourceType: "module",
};

const parseCommentProgram = (
    cache: ReadonlyMap<string, es.Program | null>,
    content: string
): readonly [
    ReadonlyMap<string, es.Program | null>,
    es.Program | undefined,
] => {
    const cached = cache.get(content);
    if (cached !== undefined) {
        return [cache, cached ?? undefined];
    }

    try {
        const parsed = parser.parse(content, parserOptions);
        const nextCache = new Map(cache);
        nextCache.set(content, parsed);
        return [nextCache, parsed];
    } catch {
        const nextCache = new Map(cache);
        nextCache.set(content, null);
        return [nextCache, undefined];
    }
};

const isRegionComment = (content: string): boolean => {
    const normalized = content.trimStart().toLowerCase();
    return (
        normalized.startsWith("#endregion") || normalized.startsWith("#region")
    );
};

const stripLeadingAsterisk = (line: string): string => {
    const trimmedLine = line.trimStart();
    if (!trimmedLine.startsWith("*")) {
        return line;
    }

    return trimmedLine.slice(1);
};

const normalizeBlockCommentContent = (content: string): string =>
    arrayJoin(
        stringSplit(content, "\n").map((line) => stripLeadingAsterisk(line)),
        "\n"
    );

const toLocCopy = (loc: Readonly<es.SourceLocation>): es.SourceLocation => ({
    end: loc.end,
    start: loc.start,
});

const toCommentBlocks = (
    comments: readonly Readonly<es.Comment>[]
): readonly CommentBlock[] => {
    let blocks: readonly CommentBlock[] = [];
    let previousLineComment: es.LineComment | null = null;

    for (const comment of comments) {
        if (comment.type === "Block") {
            blocks = [
                ...blocks,
                {
                    content: normalizeBlockCommentContent(comment.value),
                    loc: toLocCopy(comment.loc),
                },
            ];
            previousLineComment = null;
            continue;
        }

        const previousBlockIndex =
            previousLineComment?.loc.start.line === comment.loc.start.line - 1
                ? blocks.length - 1
                : -1;
        const previousBlock =
            previousBlockIndex >= 0 ? blocks[previousBlockIndex] : undefined;

        blocks = isDefined(previousBlock)
            ? [
                  ...blocks.slice(0, previousBlockIndex),
                  {
                      content: `${previousBlock.content}\n${comment.value}`,
                      loc: {
                          end: comment.loc.end,
                          start: previousBlock.loc.start,
                      },
                  },
                  ...blocks.slice(previousBlockIndex + 1),
              ]
            : [
                  ...blocks,
                  {
                      content: comment.value,
                      loc: toLocCopy(comment.loc),
                  },
              ];

        previousLineComment = comment;
    }

    return blocks;
};

const isExpressionOrIdentifierOrLiteral = (
    node: Readonly<es.Node>
): boolean => {
    if (node.type === "Identifier" || node.type === "Literal") {
        return true;
    }

    if (node.type !== "BinaryExpression") {
        return false;
    }

    return (
        isExpressionOrIdentifierOrLiteral(node.left) &&
        isExpressionOrIdentifierOrLiteral(node.right)
    );
};

const isTrivialProgram = (program: Readonly<es.Program>): boolean => {
    if (program.body.length === 0) {
        return true;
    }

    if (
        program.body.length === 1 &&
        arrayFirst(program.body)?.type === "LabeledStatement"
    ) {
        return true;
    }

    return program.body.every(
        (statement) =>
            statement.type === "ExpressionStatement" &&
            isExpressionOrIdentifierOrLiteral(statement.expression)
    );
};

const getWrappedContent = (
    content: string,
    node: null | Readonly<es.Node>
): string | undefined => {
    if (node === null) {
        return undefined;
    }

    if (node.type === "ArrayExpression") {
        return `const wrapper = [${content}]`;
    }

    if (node.type === "ClassBody") {
        return `class Wrapper { ${content} }`;
    }

    if (node.type === "FunctionDeclaration") {
        return `function wrapper(${content}) {}`;
    }

    if (node.type === "ImportDeclaration") {
        return `import { ${content} } from "wrapper"`;
    }

    if (node.type === "ObjectExpression") {
        return `const wrapper = { ${content} }`;
    }

    if (node.type === "SwitchStatement") {
        return `switch (wrapper) { ${content} }`;
    }

    if (node.type === "TSInterfaceBody") {
        return `interface Wrapper { ${content} }`;
    }

    if (node.type === "TSTypeLiteral") {
        return `type Wrapper = { ${content} }`;
    }

    return undefined;
};

/**
 * Disallow comment blocks that appear to contain executable or declaration
 * code.
 */
const rule: ReturnType<typeof ruleCreator<readonly [], MessageIds>> =
    ruleCreator<readonly [], MessageIds>({
        create: (context) => {
            let parseCache: ReadonlyMap<string, es.Program | null> = new Map<
                string,
                es.Program | null
            >();

            return {
                Program: () => {
                    const { sourceCode } = context;

                    for (const block of toCommentBlocks(
                        sourceCode.getAllComments()
                    )) {
                        if (isRegionComment(block.content)) {
                            continue;
                        }

                        const [nextCacheAfterParse, parsedComment] =
                            parseCommentProgram(parseCache, block.content);
                        parseCache = nextCacheAfterParse;
                        if (parsedComment !== undefined) {
                            if (!isTrivialProgram(parsedComment)) {
                                context.report({
                                    loc: block.loc,
                                    messageId: "forbidden",
                                });
                            }

                            continue;
                        }

                        const index = sourceCode.getIndexFromLoc(
                            block.loc.start
                        );
                        const node = sourceCode.getNodeByRangeIndex(index);
                        const wrappedContent = getWrappedContent(
                            block.content,
                            node
                        );
                        if (!isDefined(wrappedContent)) {
                            continue;
                        }

                        const [
                            nextCacheAfterWrappedParse,
                            parsedWrappedComment,
                        ] = parseCommentProgram(parseCache, wrappedContent);
                        parseCache = nextCacheAfterWrappedParse;

                        if (parsedWrappedComment !== undefined) {
                            context.report({
                                loc: block.loc,
                                messageId: "forbidden",
                            });
                        }
                    }
                },
            };
        },
        defaultOptions: [],
        meta: {
            deprecated: true,
            docs: {
                deprecated: true,
                description: "disallow commented-out code blocks.",
                frozen: true,
                recommended: false,
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-commented-out-code",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Commented-out code is forbidden.",
            },
            schema: [],
            type: "problem",
        },
        name: "no-commented-out-code",
    });

/**
 * Wrapper rule with explicit lifecycle metadata and replacement mapping.
 */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    message:
        "Deprecated in favor of eslint-plugin-no-commented-code/no-commented-code.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "no-commented-code",
                url: "https://www.npmjs.com/package/eslint-plugin-no-commented-code",
            },
            rule: {
                name: "no-commented-code",
                url: "https://www.npmjs.com/package/eslint-plugin-no-commented-code",
            },
        }),
    ],
    ruleId: "no-commented-out-code",
});

export default deprecatedRule;
