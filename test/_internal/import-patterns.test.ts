import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import {
    getImportSourceFromNode,
    shouldReportImportSource,
} from "../../src/_internal/import-patterns";

const fixtureFilePath = path.resolve(
    process.cwd(),
    "test/fixtures/internal/import-sources.fixture.txt"
);

const globSafeModuleNameArbitrary = fc
    .array(
        fc.constantFrom(
            "-",
            ".",
            "/",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "@",
            "_",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z"
        ),
        {
            maxLength: 24,
            minLength: 1,
        }
    )
    .map((characters) => characters.join(""));

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFileSync(fixtureFilePath, "utf8"), {
        ecmaVersion: "latest",
        filePath: fixtureFilePath,
        sourceType: "module",
    }).ast;

const getImportExpressionsFromProgram = (
    program: Readonly<TSESTree.Program>
): readonly TSESTree.ImportExpression[] => {
    const importExpressions: TSESTree.ImportExpression[] = [];

    for (const statement of program.body) {
        if (statement.type === AST_NODE_TYPES.ExpressionStatement) {
            const expression =
                statement.expression.type === AST_NODE_TYPES.UnaryExpression
                    ? statement.expression.argument
                    : statement.expression;

            if (expression.type === AST_NODE_TYPES.ImportExpression) {
                importExpressions.push(expression);
            }
        }
    }

    return importExpressions;
};

const assertImportAndExportNodes = (
    program: Readonly<TSESTree.Program>
): Readonly<{
    exportAllDeclaration: TSESTree.ExportAllDeclaration;
    exportNamedDeclaration: TSESTree.ExportNamedDeclaration;
    importDeclaration: TSESTree.ImportDeclaration;
}> => {
    const importDeclaration = program.body[0];
    const exportNamedDeclaration = program.body[1];
    const exportAllDeclaration = program.body[2];

    expect(importDeclaration?.type).toBe(AST_NODE_TYPES.ImportDeclaration);
    expect(exportNamedDeclaration?.type).toBe(
        AST_NODE_TYPES.ExportNamedDeclaration
    );
    expect(exportAllDeclaration?.type).toBe(
        AST_NODE_TYPES.ExportAllDeclaration
    );

    if (
        importDeclaration?.type !== AST_NODE_TYPES.ImportDeclaration ||
        exportNamedDeclaration?.type !==
            AST_NODE_TYPES.ExportNamedDeclaration ||
        exportAllDeclaration?.type !== AST_NODE_TYPES.ExportAllDeclaration
    ) {
        throw new TypeError(
            "Fixture did not produce expected import/export nodes."
        );
    }

    return {
        exportAllDeclaration,
        exportNamedDeclaration,
        importDeclaration,
    };
};

describe("import source extraction", () => {
    it("extracts source text for supported import/export node types", () => {
        expect.hasAssertions();

        const program = parseFixtureProgram();
        const {
            exportAllDeclaration,
            exportNamedDeclaration,
            importDeclaration,
        } = assertImportAndExportNodes(program);
        const importExpressions = getImportExpressionsFromProgram(program);

        expect(getImportSourceFromNode(importDeclaration)).toBe(
            "@scope/package"
        );
        expect(getImportSourceFromNode(exportNamedDeclaration)).toBe("./named");
        expect(getImportSourceFromNode(exportAllDeclaration)).toBe("../all");
        expect(getImportSourceFromNode(importExpressions[0]!)).toBe(
            "./dynamic"
        );
        expect(getImportSourceFromNode(importExpressions[1]!)).toBeUndefined();
        expect(getImportSourceFromNode(program)).toBeUndefined();
    });
});

describe("import source reporting decisions", () => {
    it("reports only when disallowed and not explicitly allowed", () => {
        expect.hasAssertions();
        expect(
            shouldReportImportSource(
                "@internal/secret",
                {
                    allow: ["@internal/public/**"],
                    disallow: ["@internal/**"],
                },
                ["@legacy/**"]
            )
        ).toBe(true);
        expect(
            shouldReportImportSource(
                "@internal/public/thing",
                {
                    allow: ["@internal/public/**"],
                    disallow: ["@internal/**"],
                },
                ["@legacy/**"]
            )
        ).toBe(false);
        expect(
            shouldReportImportSource("@legacy/path", undefined, ["@legacy/**"])
        ).toBe(true);
    });

    it("respects disallow and allow precedence for arbitrary module names", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(globSafeModuleNameArbitrary, (sourceText) => {
                expect(
                    shouldReportImportSource(
                        sourceText,
                        { disallow: [sourceText] },
                        []
                    )
                ).toBe(true);
                expect(
                    shouldReportImportSource(
                        sourceText,
                        {
                            allow: [sourceText],
                            disallow: [sourceText],
                        },
                        []
                    )
                ).toBe(false);
                expect(
                    shouldReportImportSource(sourceText, undefined, [
                        sourceText,
                    ])
                ).toBe(true);
            })
        );
    });
});
