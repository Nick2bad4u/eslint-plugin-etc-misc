import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const syntaxFixturePath = "test/fixtures/internal/import-sources.fixture.txt";

const readSyntaxFixture = (): string => readFileSync(syntaxFixturePath, "utf8");

const requireSyntaxRule = plugin.rules["require-syntax"];

if (requireSyntaxRule === undefined) {
    throw new TypeError(
        "Rule 'require-syntax' was not found in plugin export."
    );
}

describe("require-syntax fixture parser shape", () => {
    it("contains import/export and import-expression syntax forms", () => {
        const program = parser.parseForESLint(readSyntaxFixture(), {
            ecmaVersion: "latest",
            sourceType: "module",
        }).ast;

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ImportDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportNamedDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportAllDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExpressionStatement &&
                    statement.expression.type ===
                        AST_NODE_TYPES.UnaryExpression &&
                    statement.expression.argument.type ===
                        AST_NODE_TYPES.ImportExpression
            )
        ).toBeTruthy();
    });
});

ruleTester.run("require-syntax", requireSyntaxRule, {
    invalid: [
        {
            code: "const x = 1;",
            errors: [{ messageId: "missing" }],
            options: [{ selectors: ["ExportDefaultDeclaration"] }],
        },
        {
            code: "const x = 1;",
            errors: [
                {
                    data: {
                        message: "Need a default export.",
                    },
                    messageId: "customMessage",
                },
            ],
            options: [
                {
                    selectors: [
                        {
                            message: "Need a default export.",
                            selector: "ExportDefaultDeclaration",
                        },
                    ],
                },
            ],
        },
        {
            code: "export default 1;",
            errors: [{ messageId: "missing" }],
            options: [
                {
                    selectors: ["ExportDefaultDeclaration", "ClassDeclaration"],
                },
            ],
        },
        {
            code: readSyntaxFixture(),
            errors: [
                {
                    data: {
                        message: "Missing default export",
                    },
                    messageId: "customMessage",
                },
            ],
            options: [
                {
                    selectors: [
                        {
                            message: "Missing default export",
                            selector: "ExportDefaultDeclaration",
                        },
                    ],
                },
            ],
        },
        {
            code: "const x = 1;",
            errors: [
                {
                    data: {
                        message: "Need a class declaration",
                    },
                    messageId: "customMessage",
                },
                { messageId: "missing" },
            ],
            options: [
                {
                    selectors: [
                        {
                            message: "Need a class declaration",
                            selector: "ClassDeclaration",
                        },
                        "ExportDefaultDeclaration",
                    ],
                },
            ],
        },
    ],
    valid: [
        {
            code: "export default 1;",
            options: [{ selectors: ["ExportDefaultDeclaration"] }],
        },
        {
            code: readSyntaxFixture(),
            options: [
                {
                    selectors: [
                        "ImportDeclaration",
                        "ExportNamedDeclaration",
                        "ExportAllDeclaration",
                    ],
                },
            ],
        },
        {
            code: readSyntaxFixture(),
            options: [
                {
                    selectors: ["ImportExpression"],
                },
            ],
        },
        {
            code: "const x = 1;",
            options: [{ selectors: [] }],
        },
        {
            code: "const x = 1;",
        },
        {
            code: readSyntaxFixture(),
            options: [
                {
                    selectors: [
                        {
                            message: "Need imports",
                            selector: "ImportDeclaration",
                        },
                    ],
                },
            ],
        },
    ],
});
