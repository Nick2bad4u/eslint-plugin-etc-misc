import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/sort-keys.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const readFixtureWithExpectedFixes = (): string =>
    readFixture()
        .replace(
            "const unsortedIdentifiers = { b: 1, a: 2 };",
            "const unsortedIdentifiers = { a: 2, b: 1 };"
        )
        .replace(
            'const unsortedLiteralKeys = { "zeta": 1, "alpha": 2 };',
            'const unsortedLiteralKeys = { "alpha": 2, "zeta": 1 };'
        )
        .replace(
            "const withComputedStillUnsorted = { [dynamicKey]: 0, b: 2, a: 1 };",
            "const withComputedStillUnsorted = { [dynamicKey]: 0, a: 1, b: 2 };"
        )
        .replace(
            "const withSpreadStillUnsorted = { ...source, b: 2, a: 1 };",
            "const withSpreadStillUnsorted = { ...source, a: 1, b: 2 };"
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

const collectObjectExpressions = (
    program: TSESTree.Program
): readonly TSESTree.ObjectExpression[] => {
    const objects: TSESTree.ObjectExpression[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            if (node.type === AST_NODE_TYPES.ObjectExpression) {
                objects.push(node);
            }

            for (const value of Object.values(node)) {
                stack.push(...toChildNodes(value));
            }
        }
    }

    return objects;
};

const getSortKeysRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["sort-keys"]
> => {
    const ruleModule = plugin.rules["sort-keys"];

    if (ruleModule === undefined) {
        throw new TypeError("Rule 'sort-keys' was not found in plugin export.");
    }

    return ruleModule;
};

describe("sort-keys fixture structure", () => {
    it("contains literal, computed, spread, and numeric-key object properties", () => {
        const objects = collectObjectExpressions(parseFixtureProgram());

        expect(
            objects.some((objectExpression) =>
                objectExpression.properties.some(
                    (property) =>
                        property.type === AST_NODE_TYPES.Property &&
                        property.key.type === AST_NODE_TYPES.Literal &&
                        typeof property.key.value === "string"
                )
            )
        ).toBeTruthy();

        expect(
            objects.some((objectExpression) =>
                objectExpression.properties.some(
                    (property) =>
                        property.type === AST_NODE_TYPES.Property &&
                        property.computed
                )
            )
        ).toBeTruthy();

        expect(
            objects.some((objectExpression) =>
                objectExpression.properties.some(
                    (property) => property.type === AST_NODE_TYPES.SpreadElement
                )
            )
        ).toBeTruthy();

        expect(
            objects.some((objectExpression) =>
                objectExpression.properties.some(
                    (property) =>
                        property.type === AST_NODE_TYPES.Property &&
                        property.key.type === AST_NODE_TYPES.Literal &&
                        typeof property.key.value === "number"
                )
            )
        ).toBeTruthy();
    });

    it("parses generated object literals from fast-check", () => {
        fc.assert(
            fc.property(
                fc.uniqueArray(
                    fc.constantFrom("alpha", "beta", "delta", "gamma"),
                    {
                        maxLength: 4,
                        minLength: 2,
                    }
                ),
                (keys) => {
                    const members = keys
                        .map((key, index) => `${key}: ${index + 1}`)
                        .join(", ");
                    const source = `const value = { ${members} };`;
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

ruleTester.run("sort-keys", getSortKeysRuleFromPlugin(), {
    invalid: [
        {
            code: "const value = { b: 1, a: 2 };",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const value = { a: 2, b: 1 };",
        },
        {
            code: 'const value = { "zeta": 1, "alpha": 2 };',
            errors: [{ messageId: "incorrectSorting" }],
            output: 'const value = { "alpha": 2, "zeta": 1 };',
        },
        {
            code: "const value = { [dynamicKey]: 0, b: 2, a: 1 };",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const value = { [dynamicKey]: 0, a: 1, b: 2 };",
        },
        {
            code: "const value = { ...source, b: 2, a: 1 };",
            errors: [{ messageId: "incorrectSorting" }],
            output: "const value = { ...source, a: 1, b: 2 };",
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
            code: "const value = { a: 1, b: 2 };",
        },
        {
            code: "const value = { 1: 'one', a: 'a' };",
        },
        {
            code: "const value = { get b() { return 2; }, a: 1 };",
        },
        {
            code: "const value = { [dynamicKey]: 0, a: 1, b: 2 };",
        },
        {
            code: "const value = { ...source, a: 1, b: 2 };",
        },
    ],
});
