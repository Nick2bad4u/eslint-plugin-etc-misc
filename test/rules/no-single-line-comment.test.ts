import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_TOKEN_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/no-single-line-comment.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const fixtureWithRationaleAsBlock = (): string =>
    readFixture().replace("// rationale", "/* rationale */");

const fixtureWithNotDirectiveAsBlock = (): string =>
    readFixture().replace("// notDirective", "/* notDirective */");

const fixtureWithNonDirectiveCommentsAsBlock = (): string =>
    fixtureWithNotDirectiveAsBlock().replace("// rationale", "/* rationale */");

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        comment: true,
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const getNoSingleLineCommentRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["no-single-line-comment"]
> => {
    const ruleModule = plugin.rules["no-single-line-comment"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'no-single-line-comment' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("no-single-line-comment fixture structure", () => {
    it("contains directive, non-directive, and block comments", () => {
        const program = parseFixtureProgram();
        const comments = program.comments ?? [];

        expect(
            comments.some(
                (comment) =>
                    comment.type === AST_TOKEN_TYPES.Line &&
                    comment.value.trimStart().startsWith("global ")
            )
        ).toBeTruthy();

        expect(
            comments.some(
                (comment) =>
                    comment.type === AST_TOKEN_TYPES.Line &&
                    comment.value.trimStart().startsWith("ts-ignore")
            )
        ).toBeTruthy();

        expect(
            comments.some(
                (comment) =>
                    comment.type === AST_TOKEN_TYPES.Line &&
                    comment.value.trimStart() === "rationale"
            )
        ).toBeTruthy();

        expect(
            comments.some((comment) => comment.type === AST_TOKEN_TYPES.Block)
        ).toBeTruthy();
    });

    it("parses generated single-line comments from fast-check", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer({ max: 99, min: 0 }), {
                    maxLength: 4,
                    minLength: 1,
                }),
                (parts) => {
                    const commentText = parts.map(String).join("-");
                    const code = [
                        `// ${commentText}`,
                        `const value = ${parts.length};`,
                    ].join("\n");

                    const program = parser.parseForESLint(code, {
                        comment: true,
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const comments = program.comments ?? [];

                    expect(comments[0]?.type).toBe(AST_TOKEN_TYPES.Line);
                }
            ),
            {
                numRuns: 20,
                seed: 20_260_310,
            }
        );
    });
});

ruleTester.run(
    "no-single-line-comment",
    getNoSingleLineCommentRuleFromPlugin(),
    {
        invalid: [
            {
                code: ["// explanation", "const value = 1;"].join("\n"),
                errors: [
                    {
                        messageId: "forbidden",
                        suggestions: [
                            {
                                messageId: "suggestConvertToBlock",
                                output: [
                                    "/* explanation */",
                                    "const value = 1;",
                                ].join("\n"),
                            },
                        ],
                    },
                ],
                output: ["/* explanation */", "const value = 1;"].join("\n"),
            },
            {
                code: [
                    "// global SharedRuntimeGlobal",
                    "const value = 1;",
                ].join("\n"),
                errors: [{ messageId: "forbidden" }],
                options: [{ allowDirectiveComments: false }],
            },
            {
                code: readFixture(),
                errors: [
                    {
                        messageId: "forbidden",
                        suggestions: [
                            {
                                messageId: "suggestConvertToBlock",
                                output: fixtureWithRationaleAsBlock(),
                            },
                        ],
                    },
                    {
                        messageId: "forbidden",
                        suggestions: [
                            {
                                messageId: "suggestConvertToBlock",
                                output: fixtureWithNotDirectiveAsBlock(),
                            },
                        ],
                    },
                ],
                output: fixtureWithNonDirectiveCommentsAsBlock(),
            },
            {
                code: readFixture(),
                errors: [
                    { messageId: "forbidden" },
                    { messageId: "forbidden" },
                    {
                        messageId: "forbidden",
                        suggestions: [
                            {
                                messageId: "suggestConvertToBlock",
                                output: fixtureWithRationaleAsBlock(),
                            },
                        ],
                    },
                    {
                        messageId: "forbidden",
                        suggestions: [
                            {
                                messageId: "suggestConvertToBlock",
                                output: fixtureWithNotDirectiveAsBlock(),
                            },
                        ],
                    },
                ],
                options: [{ allowDirectiveComments: false }],
                output: fixtureWithNonDirectiveCommentsAsBlock(),
            },
            {
                code: ["// text */ tricky", "const value = 1;"].join("\n"),
                errors: [{ messageId: "forbidden" }],
            },
        ],
        valid: [
            {
                code: ["/* explanation */", "const value = 1;"].join("\n"),
            },
            {
                code: [
                    "// global SharedRuntimeGlobal",
                    "const value = 1;",
                ].join("\n"),
            },
            {
                code: ["//    ts-ignore", "const value = 1;"].join("\n"),
            },
            {
                code: "const value = 1;",
                options: [{ allowDirectiveComments: false }],
            },
        ],
    }
);
