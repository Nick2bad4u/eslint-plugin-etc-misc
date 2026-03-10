import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/typescript-prefer-enum.fixture.ts";

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

const getTypescriptPreferEnumRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["typescript/prefer-enum"]
> => {
    const ruleModule = plugin.rules["typescript/prefer-enum"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'typescript/prefer-enum' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("typescript-prefer-enum fixture structure", () => {
    it("contains enum comparisons, enum-return strings, and string-literal unions", () => {
        const nodes = collectNodes(parseFixtureProgram());

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.TSEnumDeclaration)
        ).toBeTruthy();

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.BinaryExpression &&
                    (node.operator === "==" ||
                        node.operator === "===" ||
                        node.operator === "!=" ||
                        node.operator === "!==")
            )
        ).toBeTruthy();

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.ReturnStatement &&
                    node.argument?.type === AST_NODE_TYPES.Literal &&
                    typeof node.argument.value === "string"
            )
        ).toBeTruthy();

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.TSTypeAliasDeclaration &&
                    node.typeAnnotation.type === AST_NODE_TYPES.TSUnionType
            )
        ).toBeTruthy();
    });

    it("parses generated string-literal unions from fast-check", () => {
        fc.assert(
            fc.property(
                fc.uniqueArray(
                    fc.constantFrom("alpha", "beta", "delta", "gamma"),
                    {
                        maxLength: 4,
                        minLength: 2,
                    }
                ),
                (values) => {
                    const union = values
                        .map((value) => `"${value}"`)
                        .join(" | ");
                    const source = `type Generated = ${union};`;
                    const program = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const statement = program.body[0];

                    expect(statement?.type).toBe(
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

ruleTester.run(
    "typescript-prefer-enum",
    getTypescriptPreferEnumRuleFromPlugin(),
    {
        invalid: [
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "const getStatus = (): Status => {",
                    "    return 'open';",
                    "};",
                    "console.log(getStatus());",
                ].join("\n"),
                errors: [{ messageId: "preferEnumReturn" }],
            },
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "function getStatus(flag: boolean): Status | undefined {",
                    "    if (flag) {",
                    "        return 'open';",
                    "    }",
                    "",
                    "    return undefined;",
                    "}",
                    "void getStatus;",
                ].join("\n"),
                errors: [{ messageId: "preferEnumReturn" }],
            },
            {
                code: "type Status = 'open' | 'closed';",
                errors: [{ messageId: "preferEnumUnion" }],
            },
            {
                code: readFixture(),
                errors: [
                    { messageId: "preferEnumComparison" },
                    { messageId: "preferEnumComparison" },
                    { messageId: "preferEnumComparison" },
                    { messageId: "preferEnumReturn" },
                    { messageId: "preferEnumUnion" },
                ],
            },
        ],
        valid: [
            {
                code: "enum Status { Open = 'open', Closed = 'closed' }",
            },
            {
                code: [
                    "type Status = string;",
                    "declare const status: Status;",
                    "const isOpen = status === 'open';",
                    "console.log(isOpen);",
                ].join("\n"),
            },
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "declare const status: Status;",
                    "const isOpen = status === 'open';",
                    "void isOpen;",
                ].join("\n"),
            },
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "declare const status: Status;",
                    "const isClosed = 'closed' !== status;",
                    "void isClosed;",
                ].join("\n"),
            },
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "declare const status: Status | undefined;",
                    "const isOpen = status == 'open';",
                    "void isOpen;",
                ].join("\n"),
            },
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "declare const status: Status;",
                    "const ordered = status > 'open';",
                    "void ordered;",
                ].join("\n"),
            },
            {
                code: "type Status = 'open' | 1;",
            },
            {
                code: "type Status = 'open';",
            },
            {
                code: [
                    "enum Status { Open = 'open', Closed = 'closed' }",
                    "const getStatus = (): Status => Status.Open;",
                    "void getStatus;",
                ].join("\n"),
            },
            {
                code: "function text(flag: boolean): string { return flag ? 'a' : 'b'; }",
            },
            {
                code: "function count(): number { return 1; }",
            },
        ],
    }
);
