import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/object-format.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const isTSESTreeNode = (value: unknown): value is TSESTree.Node =>
    typeof value === "object" && value !== null && "type" in value;

const pushChildNodes = (value: unknown, stack: TSESTree.Node[]): void => {
    if (Array.isArray(value)) {
        for (const item of value) {
            if (isTSESTreeNode(item)) {
                stack.push(item);
            }
        }

        return;
    }

    if (isTSESTreeNode(value)) {
        stack.push(value);
    }
};

const collectObjectExpressions = (
    program: TSESTree.Program
): readonly TSESTree.ObjectExpression[] => {
    const objectExpressions: TSESTree.ObjectExpression[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            if (node.type === AST_NODE_TYPES.ObjectExpression) {
                objectExpressions.push(node);
            }

            for (const value of Object.values(node)) {
                if (value !== null && value !== undefined) {
                    pushChildNodes(value, stack);
                }
            }
        }
    }

    return objectExpressions;
};

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const getObjectFormatRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["object-format"]
> => {
    const ruleModule = plugin.rules["object-format"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'object-format' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("object-format fixture structure", () => {
    it("contains single-line and multi-line object literals", () => {
        const program = parseFixtureProgram();
        const objectExpressions = collectObjectExpressions(program);

        expect(
            objectExpressions.some(
                (expression) =>
                    expression.loc.start.line === expression.loc.end.line
            )
        ).toBeTruthy();

        expect(
            objectExpressions.some(
                (expression) =>
                    expression.loc.start.line !== expression.loc.end.line
            )
        ).toBeTruthy();
    });

    it("parses generated object literals from fast-check", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer({ max: 99, min: 0 }), {
                    maxLength: 4,
                    minLength: 2,
                }),
                (values) => {
                    const propertySource = values
                        .map((value, index) => `k${index}: ${value}`)
                        .join(", ");
                    const source = `const value = { ${propertySource} };`;

                    const ast = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const declaration = ast.body[0];

                    expect(declaration?.type).toBe(
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

ruleTester.run("object-format", getObjectFormatRuleFromPlugin(), {
    invalid: [
        {
            code: "const value = { a: 1, b: 2 };",
            errors: [{ messageId: "inconsistent" }],
        },
        {
            code: "const value = { a: 1, b: 2 };",
            errors: [{ messageId: "inconsistent" }],
            options: [{ maxProperties: 0 }],
        },
        {
            code: [
                "const value = {",
                "  a: 1,",
                "  b: 2,",
                "};",
            ].join("\n"),
            errors: [{ messageId: "inconsistent" }],
            options: [{ maxProperties: 2 }],
        },
        {
            code: readFixture(),
            errors: Array.from({ length: 2 }, () => ({
                messageId: "inconsistent",
            })),
        },
    ],
    valid: [
        {
            code: "const value = { a: 1 };",
        },
        {
            code: [
                "const value = {",
                "  a: 1,",
                "  b: 2,",
                "};",
            ].join("\n"),
        },
        {
            code: "const value = { a: 1, b: 2 };",
            options: [{ maxProperties: 2 }],
        },
        {
            code: "const value = { ...source, b: 2 };",
            options: [{ maxProperties: 2 }],
        },
        {
            code: [
                "const value = {",
                "  a: 1,",
                "};",
            ].join("\n"),
            options: [{ maxProperties: 0 }],
        },
    ],
});
