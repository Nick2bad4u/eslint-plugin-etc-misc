import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/sort-array.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const readFixtureWithExpectedFixes = (): string => {
    const fixture = readFixture();
    const newline = fixture.includes("\r\n") ? "\r\n" : "\n";

    return fixture
        .replace(
            "const numbersNeedSorting = [2, 1];",
            "const numbersNeedSorting = [1, 2];"
        )
        .replace(
            [
                "const stringsNeedSorting = [",
                '    "b",',
                '    "a",',
                '    "c",',
                "];",
            ].join(newline),
            [
                "const stringsNeedSorting = [",
                '    "a", "b", "c",',
                "];",
            ].join(newline)
        );
};

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

const collectArrayExpressions = (
    program: TSESTree.Program
): readonly TSESTree.ArrayExpression[] => {
    const arrays: TSESTree.ArrayExpression[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            if (node.type === AST_NODE_TYPES.ArrayExpression) {
                arrays.push(node);
            }

            for (const value of Object.values(node)) {
                stack.push(...toChildNodes(value));
            }
        }
    }

    return arrays;
};

const getSortArrayRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["sort-array"]
> => {
    const ruleModule = plugin.rules["sort-array"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'sort-array' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("sort-array fixture structure", () => {
    it("contains literal arrays plus spread and hole edge cases", () => {
        expect.hasAssertions();

        const arrays = collectArrayExpressions(parseFixtureProgram());

        expect(
            arrays.some((arrayExpression) =>
                arrayExpression.elements.some(
                    (element) => element?.type === AST_NODE_TYPES.SpreadElement
                )
            )
        ).toBeTruthy();

        expect(
            arrays.some((arrayExpression) =>
                arrayExpression.elements.includes(null)
            )
        ).toBeTruthy();

        expect(
            arrays.some((arrayExpression) => {
                let nonNullElementCount = 0;

                for (const element of arrayExpression.elements) {
                    if (element !== null) {
                        nonNullElementCount += 1;
                    }
                }

                return nonNullElementCount >= 2;
            })
        ).toBeTruthy();
    });

    it("parses generated literal arrays from fast-check", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(
                fc.array(fc.integer({ max: 50, min: 0 }), {
                    maxLength: 5,
                    minLength: 2,
                }),
                (numbers) => {
                    const members = numbers.map((number) => `"v${number}"`);
                    const source = `const values = [${members.join(", ")}];`;
                    const ast = parser.parseForESLint(source, {
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

ruleTester.run("sort-array", getSortArrayRuleFromPlugin(), {
    invalid: [
        {
            code: "const values = ['b', 'a'];",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const values = ['a', 'b'];",
        },
        {
            code: "const values = [2, 1];",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const values = [1, 2];",
        },
        {
            code: "const values = [, 'b', 'a'];",
            errors: [{ messageId: "incorrectSorting" }],
        },
        {
            code: "const values = ['b', 'a', ,];",
            errors: [{ messageId: "incorrectSorting" }],
        },
        {
            code: readFixture(),
            errors: Array.from({ length: 4 }, () => ({
                messageId: "incorrectSorting",
            })),
            output: readFixtureWithExpectedFixes(),
        },
    ],
    valid: [
        {
            code: "const values = ['a', 'b'];",
        },
        {
            code: "const values = ['a'];",
        },
        {
            code: "const alpha = 'a'; const values = [alpha, 'b'];",
        },
        {
            code: "const rest = ['c']; const values = ['b', ...rest, 'a'];",
        },
        {
            code: "const values = [, 'a'];",
        },
    ],
});
