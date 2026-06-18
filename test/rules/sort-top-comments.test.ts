import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/sort-top-comments.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const readFixtureWithExpectedFixes = (): string =>
    readFixture().replace(
        /\/\/ zebra\r?\n\/\* alpha \*\/\r?\n\/\/ beta/v,
        "/* alpha */\n// beta\n// zebra"
    );

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        comment: true,
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const getSortTopCommentsRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["sort-top-comments"]
> => {
    const ruleModule = plugin.rules["sort-top-comments"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'sort-top-comments' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("sort-top-comments fixture structure", () => {
    it("contains mixed top comments and an inline comment near code", () => {
        expect.hasAssertions();

        const ast = parseFixtureProgram();
        const firstNode = ast.body[0];

        expect(firstNode?.type).toBe(AST_NODE_TYPES.VariableDeclaration);

        const comments = ast.comments ?? [];

        expect(
            comments.some((comment) => comment.type === AST_TOKEN_TYPES.Block)
        ).toBe(true);

        expect(
            comments.some((comment) => comment.type === AST_TOKEN_TYPES.Line)
        ).toBe(true);

        const firstNodeStartLine = firstNode?.loc.start.line ?? 0;

        expect(
            comments.some(
                (comment) => comment.loc.end.line === firstNodeStartLine
            )
        ).toBe(false);

        expect(
            comments.some(
                (comment) => comment.loc.end.line > firstNodeStartLine
            )
        ).toBe(true);
    });

    it("parses generated top-comment snippets from fast-check", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(
                fc.uniqueArray(
                    fc.constantFrom("alpha", "beta", "delta", "gamma"),
                    {
                        maxLength: 4,
                        minLength: 2,
                    }
                ),
                (values) => {
                    const commentLines = values
                        .map((value) => `// ${value}`)
                        .join("\n");
                    const source = `${commentLines}\nconst value = 1;`;
                    const ast = parser.parseForESLint(source, {
                        comment: true,
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const statement = ast.body[0];

                    expect(statement?.type).toBe(
                        AST_NODE_TYPES.VariableDeclaration
                    );
                }
            ),
            {
                numRuns: 20,
                seed: 20_260_310,
            }
        );
    });
});

ruleTester.run("sort-top-comments", getSortTopCommentsRuleFromPlugin(), {
    invalid: [
        {
            code: "// zebra\n// alpha\nconst value = 1;",
            errors: [{ messageId: "incorrectSorting" }],
            output: "// alpha\n// zebra\nconst value = 1;",
        },
        {
            code: "// zebra\n/* alpha */\nconst value = 1;",
            errors: [{ messageId: "incorrectSorting" }],
            output: "/* alpha */\n// zebra\nconst value = 1;",
        },
        {
            code: readFixture(),
            errors: [{ messageId: "incorrectSorting" }],
            output: readFixtureWithExpectedFixes(),
        },
    ],
    valid: [
        {
            code: "",
        },
        {
            code: "// alpha\nconst value = 1;",
        },
        {
            code: "// alpha\n// zebra\nconst value = 1;",
        },
        {
            code: "/* alpha */\n// zebra\nconst value = 1;",
        },
        {
            code: "/* alpha */ const value = 1;",
        },
        {
            code: "const value = 1;",
        },
    ],
});
