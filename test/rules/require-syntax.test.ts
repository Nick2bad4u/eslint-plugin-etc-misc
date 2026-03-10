import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/require-syntax.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const isNode = (value: unknown): value is TSESTree.Node =>
    typeof value === "object" && value !== null && "type" in value;

const toChildNodes = (value: unknown): readonly TSESTree.Node[] => {
    if (Array.isArray(value)) {
        const nodes: TSESTree.Node[] = [];

        for (const item of value) {
            if (isNode(item)) {
                nodes.push(item);
            }
        }

        return nodes;
    }

    return isNode(value) ? [value] : [];
};

const collectNodes = (program: TSESTree.Program): readonly TSESTree.Node[] => {
    const nodes: TSESTree.Node[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            nodes.push(node);

            for (const value of Object.values(node)) {
                stack.push(...toChildNodes(value));
            }
        }
    }

    return nodes;
};

const getRequireSyntaxRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["require-syntax"]
> => {
    const ruleModule = plugin.rules["require-syntax"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'require-syntax' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("require-syntax fixture parser shape", () => {
    it("contains import/export/class and import-expression forms without default export", () => {
        const program = parseFixtureProgram();
        const nodes = collectNodes(program);

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
                    statement.type === AST_NODE_TYPES.ClassDeclaration
            )
        ).toBeTruthy();

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.ImportExpression)
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.ExportDefaultDeclaration
            )
        ).toBeFalsy();
    });

    it("parses generated selector-heavy module snippets from fast-check", () => {
        fc.assert(
            fc.property(
                fc.uniqueArray(
                    fc.constantFrom(
                        "class GeneratedClass {}",
                        "const value = 1;",
                        "export { value };",
                        "export default 1;",
                        'void import("./dynamic");',
                        'import packageDefault from "pkg";'
                    ),
                    {
                        maxLength: 6,
                        minLength: 2,
                    }
                ),
                (fragments) => {
                    const source = fragments.join("\n");
                    const program = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    expect(program.body.length).toBeGreaterThan(0);
                }
            ),
            {
                numRuns: 20,
                seed: 20_260_310,
            }
        );
    });
});

ruleTester.run("require-syntax", getRequireSyntaxRuleFromPlugin(), {
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
            code: readFixture(),
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
            code: 'void import("./dynamic");',
            errors: [
                {
                    data: {
                        selector: "ImportDeclaration",
                    },
                    messageId: "missing",
                },
            ],
            options: [{ selectors: ["ImportDeclaration"] }],
        },
        {
            code: "const x = 1;",
            errors: [
                {
                    data: {
                        selector: "ClassDeclaration",
                    },
                    messageId: "missing",
                },
            ],
            options: [
                {
                    selectors: [{ selector: "ClassDeclaration" }],
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
        {
            code: "class Thing {}",
            errors: [{ messageId: "missing" }],
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
            code: readFixture(),
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
            code: readFixture(),
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
            options: [{}],
        },
        {
            code: "const x = 1;",
        },
        {
            code: readFixture(),
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
        {
            code: "class Thing {}",
            options: [
                {
                    selectors: [
                        {
                            message: "Need a class declaration",
                            selector: "ClassDeclaration",
                        },
                    ],
                },
            ],
        },
    ],
});
