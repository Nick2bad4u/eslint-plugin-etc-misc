import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/no-t.fixture.ts";

const readFixture = (): string => readFileSync(fixturePath, "utf8");

const parseFixtureProgram = (): TSESTree.Program =>
    parser.parseForESLint(readFixture(), {
        ecmaVersion: "latest",
        sourceType: "module",
    }).ast;

const isTSESTreeNode = (value: unknown): value is TSESTree.Node =>
    typeof value === "object" && value !== null && "type" in value;

const getParameterName = (
    node: Readonly<TSESTree.Node>
): string | undefined => {
    if (
        node.type === AST_NODE_TYPES.TSTypeParameter &&
        node.name.type === AST_NODE_TYPES.Identifier
    ) {
        return node.name.name;
    }

    return undefined;
};

const toChildNodes = (value: unknown): readonly TSESTree.Node[] => {
    if (Array.isArray(value)) {
        const nodes: TSESTree.Node[] = [];

        for (const item of value) {
            if (isTSESTreeNode(item)) {
                nodes.push(item);
            }
        }

        return nodes;
    }

    return isTSESTreeNode(value) ? [value] : [];
};

const collectTypeParameterNames = (
    program: TSESTree.Program
): readonly string[] => {
    const names: string[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            const parameterName = getParameterName(node);

            if (parameterName !== undefined) {
                names.push(parameterName);
            }

            for (const value of Object.values(node)) {
                stack.push(...toChildNodes(value));
            }
        }
    }

    return names;
};

const getNoTRuleFromPlugin = (): NonNullable<(typeof plugin.rules)["no-t"]> => {
    const ruleModule = plugin.rules["no-t"];

    if (ruleModule === undefined) {
        throw new TypeError("Rule 'no-t' was not found in plugin export.");
    }

    return ruleModule;
};

describe("no-t fixture structure", () => {
    it("contains both single-character and descriptive type parameters", () => {
        const names = collectTypeParameterNames(parseFixtureProgram());

        expect(names.some((name) => name.length === 1)).toBeTruthy();
        expect(names.some((name) => name.length > 1)).toBeTruthy();
    });

    it("parses generated generic declarations from fast-check", () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer({ max: 25, min: 0 }), {
                    maxLength: 4,
                    minLength: 1,
                }),
                (indices) => {
                    const name = `T${indices.map(String).join("")}`;
                    const source = `type Box<${name}> = { value: ${name} };`;

                    const ast = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const declaration = ast.body[0];

                    expect(declaration?.type).toBe(
                        AST_NODE_TYPES.TSTypeAliasDeclaration
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

ruleTester.run("no-t", getNoTRuleFromPlugin(), {
    invalid: [
        {
            code: "type Thing<T> = { value: T };",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "interface Box<U> { value: U; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "type Thing<Value> = { value: Value };",
            errors: [{ messageId: "prefix" }],
            options: [{ prefix: "T" }],
        },
        {
            code: "type Pair<T, Value> = [T, Value];",
            errors: [{ messageId: "forbidden" }, { messageId: "prefix" }],
            options: [{ prefix: "T" }],
        },
        {
            code: readFixture(),
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
        {
            code: [
                "type Thing<ResponseValue> = { value: ResponseValue };",
                "type Pair<Value> = [Value];",
            ].join("\n"),
            errors: [{ messageId: "prefix" }, { messageId: "prefix" }],
            options: [{ prefix: "T" }],
        },
    ],
    valid: [
        {
            code: "type Thing<Value> = { value: Value };",
        },
        {
            code: "type Thing<TValue> = { value: TValue };",
            options: [{ prefix: "T" }],
        },
        {
            code: "type Thing<Value> = { value: Value };",
            options: [{ prefix: "" }],
        },
        {
            code: "function wrap<TValue>(value: TValue): TValue { return value; }",
            options: [{ prefix: "T" }],
        },
    ],
});
