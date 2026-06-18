import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/no-self-import.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const getNoSelfImportRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["no-self-import"]
> => {
    const ruleModule = plugin.rules["no-self-import"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'no-self-import' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("no-self-import fixture structure", () => {
    it("contains import/export forms consumed by rule selectors", () => {
        expect.hasAssertions();

        const program = parseFixtureProgram();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ImportDeclaration
            )
        ).toBe(true);

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportNamedDeclaration &&
                    statement.source !== null
            )
        ).toBe(true);

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportAllDeclaration
            )
        ).toBe(true);

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExpressionStatement &&
                    statement.expression.type ===
                        AST_NODE_TYPES.UnaryExpression &&
                    statement.expression.argument.type ===
                        AST_NODE_TYPES.ImportExpression
            )
        ).toBe(true);
    });

    it("parses generated relative import snippets from fast-check", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(fc.nat(999), (suffix) => {
                const code = [
                    `import value from "./module${suffix}";`,
                    `void import("./module${suffix}");`,
                ].join("\n");

                const ast = parser.parseForESLint(code, {
                    ecmaVersion: "latest",
                    sourceType: "module",
                }).ast;

                expect(ast.body[0]?.type).toBe(
                    AST_NODE_TYPES.ImportDeclaration
                );
                expect(ast.body[1]?.type).toBe(
                    AST_NODE_TYPES.ExpressionStatement
                );
            }),
            {
                numRuns: 20,
                seed: 20_260_310,
            }
        );
    });
});

ruleTester.run("no-self-import", getNoSelfImportRuleFromPlugin(), {
    invalid: [
        {
            code: 'import value from "./file";',
            errors: [{ messageId: "forbidden" }],
            filename: "file.ts",
        },
        {
            code: 'import value from "./file.ts";',
            errors: [{ messageId: "forbidden" }],
            filename: "file.ts",
        },
        {
            code: 'export { value } from "./file";',
            errors: [{ messageId: "forbidden" }],
            filename: "file.ts",
        },
        {
            code: 'export * from "./file";',
            errors: [{ messageId: "forbidden" }],
            filename: "file.ts",
        },
        {
            code: 'void import("./file");',
            errors: [{ messageId: "forbidden" }],
            filename: "file.ts",
        },
        {
            code: 'import value from "./file";',
            errors: [{ messageId: "forbidden" }],
            filename: "file.d.ts",
        },
        {
            code: readFixture(),
            errors: Array.from({ length: 5 }, () => ({
                messageId: "forbidden",
            })),
            filename: "module.ts",
        },
    ],
    valid: [
        {
            code: 'import value from "./other-file";',
            filename: "file.ts",
        },
        {
            code: 'import value from "module-name";',
            filename: "file.ts",
        },
        {
            code: "const value = 1; export { value };",
            filename: "file.ts",
        },
        {
            code: "void import(`./file`);",
            filename: "file.ts",
        },
        {
            code: 'import value from "./file";',
            filename: "<input>",
        },
    ],
});
