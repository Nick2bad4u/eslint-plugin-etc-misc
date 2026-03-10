import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath =
    "test/fixtures/internal/export-matching-filename-only.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const getExportMatchingFilenameOnlyRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["export-matching-filename-only"]
> => {
    const ruleModule = plugin.rules["export-matching-filename-only"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'export-matching-filename-only' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("export-matching-filename-only fixture structure", () => {
    it("contains declaration/specifier/default export forms used by the rule", () => {
        const program = parseFixtureProgram();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportNamedDeclaration &&
                    statement.declaration?.type ===
                        AST_NODE_TYPES.ClassDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportNamedDeclaration &&
                    statement.specifiers.some(
                        (specifier) =>
                            specifier.type === AST_NODE_TYPES.ExportSpecifier
                    )
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportNamedDeclaration &&
                    statement.declaration?.type ===
                        AST_NODE_TYPES.FunctionDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportDefaultDeclaration
            )
        ).toBeTruthy();
    });

    it("parses generated export snippets from fast-check", () => {
        const lowercaseCharacter = fc
            .integer({ max: 122, min: 97 })
            .map((codepoint) => String.fromCodePoint(codepoint));
        const uppercaseCharacter = fc
            .integer({ max: 90, min: 65 })
            .map((codepoint) => String.fromCodePoint(codepoint));
        const digitCharacter = fc
            .integer({ max: 57, min: 48 })
            .map((codepoint) => String.fromCodePoint(codepoint));

        const identifierStartCharacter = fc.oneof(
            lowercaseCharacter,
            uppercaseCharacter
        );
        const identifierBodyCharacter = fc.oneof(
            identifierStartCharacter,
            digitCharacter
        );

        const exportedNameArbitrary = fc
            .tuple(
                identifierStartCharacter,
                fc.array(identifierBodyCharacter, {
                    maxLength: 10,
                    minLength: 1,
                })
            )
            .map(
                ([identifierStart, identifierRest]) =>
                    `${identifierStart}${identifierRest.join("")}`
            );

        fc.assert(
            fc.property(
                exportedNameArbitrary,
                exportedNameArbitrary,
                (expectedName, extraName) => {
                    fc.pre(expectedName !== extraName);

                    const code = [
                        `export class ${expectedName} {}`,
                        `const local${extraName} = 1;`,
                        `export { local${extraName} as ${extraName} };`,
                    ].join("\n");

                    const ast = parser.parseForESLint(code, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    expect(ast.body[0]?.type).toBe(
                        AST_NODE_TYPES.ExportNamedDeclaration
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

ruleTester.run(
    "export-matching-filename-only",
    getExportMatchingFilenameOnlyRuleFromPlugin(),
    {
        invalid: [
            {
                code: [
                    "export class User {}",
                    "const extra = 1;",
                    "export { extra };",
                ].join("\n"),
                errors: [{ messageId: "onlyExport" }],
                filename: "User.ts",
            },
            {
                code: readFixture(),
                errors: Array.from({ length: 3 }, () => ({
                    messageId: "onlyExport",
                })),
                filename: "ExportMatchingFilenameOnly.ts",
            },
            {
                code: [
                    "export function userProfile(): void {}",
                    "const helper = 1;",
                    "export { helper };",
                ].join("\n"),
                errors: [{ messageId: "onlyExport" }],
                filename: "user-profile.ts",
                options: [{ format: "camelCase" }],
            },
            {
                code: [
                    "const value = 1;",
                    "export { value as User };",
                    "export default 1;",
                ].join("\n"),
                errors: [{ messageId: "onlyExport" }],
                filename: "User.ts",
            },
            {
                code: [
                    "export class User {}",
                    "const alpha = 1;",
                    "const beta = 2;",
                    "export { alpha };",
                    "export { beta };",
                ].join("\n"),
                errors: Array.from({ length: 2 }, () => ({
                    messageId: "onlyExport",
                })),
                filename: "User.ts",
            },
        ],
        valid: [
            {
                code: "export class User {}",
                filename: "User.ts",
            },
            {
                code: ["export class User {}", "export const extra = 1;"].join(
                    "\n"
                ),
                filename: "User.ts",
            },
            {
                code: [
                    "export class Account {}",
                    "const helper = 1;",
                    "export { helper };",
                ].join("\n"),
                filename: "User.ts",
            },
            {
                code: [
                    "export class User {}",
                    "const helper = 1;",
                    "export { helper };",
                ].join("\n"),
                filename: "user-profile.ts",
                options: [{ format: "kebab-case" }],
            },
            {
                code: [
                    "const helper = 1;",
                    'export { helper as "User" };',
                    "export default 1;",
                ].join("\n"),
                filename: "User.ts",
            },
            {
                code: [
                    "export class User {}",
                    "const helper = 1;",
                    "export { helper };",
                ].join("\n"),
            },
        ],
    }
);
