import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/underscore-internal.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const getUnderscoreInternalRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["underscore-internal"]
> => {
    const ruleModule = plugin.rules["underscore-internal"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'underscore-internal' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("underscore-internal fixture structure", () => {
    it("contains declaration forms targeted by the rule selectors", () => {
        const program = parseFixtureProgram();

        const exportNamedDeclarations: TSESTree.ExportNamedDeclaration[] = [];

        for (const statement of program.body) {
            if (statement.type === AST_NODE_TYPES.ExportNamedDeclaration) {
                exportNamedDeclarations.push(statement);
            }
        }

        expect(
            exportNamedDeclarations.some(
                (statement) =>
                    statement.declaration?.type ===
                    AST_NODE_TYPES.VariableDeclaration
            )
        ).toBeTruthy();

        expect(
            exportNamedDeclarations.some(
                (statement) =>
                    statement.declaration?.type ===
                    AST_NODE_TYPES.FunctionDeclaration
            )
        ).toBeTruthy();

        expect(
            exportNamedDeclarations.some(
                (statement) =>
                    statement.declaration?.type ===
                    AST_NODE_TYPES.ClassDeclaration
            )
        ).toBeTruthy();

        expect(
            exportNamedDeclarations.some(
                (statement) =>
                    statement.declaration?.type ===
                    AST_NODE_TYPES.TSEnumDeclaration
            )
        ).toBeTruthy();

        expect(
            exportNamedDeclarations.some(
                (statement) =>
                    statement.declaration?.type ===
                        AST_NODE_TYPES.TSInterfaceDeclaration ||
                    statement.declaration?.type ===
                        AST_NODE_TYPES.TSTypeAliasDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportDefaultDeclaration
            )
        ).toBeTruthy();
    });

    it("parses generated internal export snippets from fast-check", () => {
        fc.assert(
            fc.property(fc.integer({ max: 999, min: 1 }), (suffix) => {
                const generatedIdentifier = `Generated${suffix}`;
                const source = `/** @internal */ export const ${generatedIdentifier} = 1;`;
                const ast = parser.parseForESLint(source, {
                    ecmaVersion: "latest",
                    sourceType: "module",
                }).ast;
                const statement = ast.body[0];

                expect(statement?.type).toBe(
                    AST_NODE_TYPES.ExportNamedDeclaration
                );
            }),
            {
                numRuns: 20,
                seed: 20_260_310,
            }
        );
    });
});

ruleTester.run(
    "underscore-internal plugin fixture integration",
    getUnderscoreInternalRuleFromPlugin(),
    {
        invalid: [
            {
                code: readFixture(),
                errors: Array.from({ length: 9 }, () => ({
                    messageId: "forbidden",
                })),
                filename: "underscore-internal.fixture.ts",
            },
        ],
        valid: [],
    }
);
