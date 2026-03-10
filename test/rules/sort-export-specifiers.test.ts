import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/sort-export-specifiers.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const readFixtureWithExpectedFixes = (): string =>
    readFixture()
        .replace("export { beta, alpha };", "export { alpha, beta };")
        .replace(
            "export { beta as b, alpha as a };",
            "export { alpha as a, beta as b };"
        )
        .replace(
            'export { beta as "zeta", alpha as "alpha" };',
            'export { alpha as "alpha", beta as "zeta" };'
        );

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const isNode = (value: unknown): value is TSESTree.Node =>
    typeof value === "object" && value !== null && "type" in value;

const toChildNodes = (value: unknown): readonly TSESTree.Node[] => {
    if (Array.isArray(value)) {
        const children: TSESTree.Node[] = [];

        for (const item of value) {
            if (isNode(item)) {
                children.push(item);
            }
        }

        return children;
    }

    return isNode(value) ? [value] : [];
};

const collectExportNamedDeclarations = (
    program: TSESTree.Program
): readonly TSESTree.ExportNamedDeclaration[] => {
    const declarations: TSESTree.ExportNamedDeclaration[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) {
                declarations.push(node);
            }

            for (const value of Object.values(node)) {
                stack.push(...toChildNodes(value));
            }
        }
    }

    return declarations;
};

const sortNames = (names: readonly string[]): readonly string[] =>
    // eslint-disable-next-line unicorn/no-array-sort -- Node.js test runtime includes versions without Array#toSorted.
    [...names].sort((left, right) => left.localeCompare(right));

const getSortExportSpecifiersRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["sort-export-specifiers"]
> => {
    const ruleModule = plugin.rules["sort-export-specifiers"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'sort-export-specifiers' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("sort-export-specifiers fixture structure", () => {
    it("contains identifier, alias, and string-literal export specifier forms", () => {
        const declarations = collectExportNamedDeclarations(
            parseFixtureProgram()
        );

        expect(
            declarations.some((declaration) =>
                declaration.specifiers.some(
                    (specifier) =>
                        specifier.type === AST_NODE_TYPES.ExportSpecifier &&
                        specifier.exported.type === AST_NODE_TYPES.Identifier &&
                        specifier.local.type === AST_NODE_TYPES.Identifier &&
                        specifier.local.name !== specifier.exported.name
                )
            )
        ).toBeTruthy();

        expect(
            declarations.some((declaration) =>
                declaration.specifiers.some(
                    (specifier) =>
                        specifier.type === AST_NODE_TYPES.ExportSpecifier &&
                        specifier.exported.type === AST_NODE_TYPES.Literal &&
                        typeof specifier.exported.value === "string"
                )
            )
        ).toBeTruthy();

        const fixtureProgram = parseFixtureProgram();

        expect(
            fixtureProgram.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportAllDeclaration
            )
        ).toBeTruthy();
    });

    it("parses generated export lists from fast-check", () => {
        fc.assert(
            fc.property(
                fc.uniqueArray(
                    fc.constantFrom("alpha", "beta", "delta", "gamma"),
                    {
                        maxLength: 4,
                        minLength: 2,
                    }
                ),
                (names) => {
                    const sortedNames = sortNames(names);
                    const exportList = sortedNames.join(", ");
                    const source = `export { ${exportList} };`;
                    const ast = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const statement = ast.body[0];

                    expect(statement?.type).toBe(
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
    "sort-export-specifiers",
    getSortExportSpecifiersRuleFromPlugin(),
    {
        invalid: [
            {
                code: "export { b, a };",
                errors: [{ messageId: "incorrectSortingOrder" }],
                output: "export { a, b };",
            },
            {
                code: "export { beta as b, alpha as a };",
                errors: [{ messageId: "incorrectSortingOrder" }],
                output: "export { alpha as a, beta as b };",
            },
            {
                code: 'export { beta as "zeta", alpha as "alpha" };',
                errors: [{ messageId: "incorrectSortingOrder" }],
                output: 'export { alpha as "alpha", beta as "zeta" };',
            },
            {
                code: readFixture(),
                errors: Array.from({ length: 3 }, () => ({
                    messageId: "incorrectSortingOrder",
                })),
                output: readFixtureWithExpectedFixes(),
            },
        ],
        valid: [
            {
                code: "export { a, b };",
            },
            {
                code: "export { alpha as a, beta as b };",
            },
            {
                code: 'export { alpha as "alpha", beta as "zeta" };',
            },
            {
                code: "export { one } from './module';",
            },
            {
                code: "export * as namespaceExport from './module';",
            },
        ],
    }
);
