import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/no-restricted-syntax.fixture.ts";

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

const getNoRestrictedSyntaxRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["no-restricted-syntax"]
> => {
    const ruleModule = plugin.rules["no-restricted-syntax"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'no-restricted-syntax' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("no-restricted-syntax fixture structure", () => {
    it("contains if/while/switch/for forms used by selector-based cases", () => {
        expect.hasAssertions();

        const nodes = collectNodes(parseFixtureProgram());

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.IfStatement)
        ).toBe(true);

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.WhileStatement)
        ).toBe(true);

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.SwitchStatement)
        ).toBe(true);

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.ForStatement)
        ).toBe(true);
    });

    it("parses generated statement snippets from fast-check", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(
                fc.constantFrom(
                    "if (condition) { call(); }",
                    "while (condition) { break; }",
                    "switch (value) { default: break; }",
                    "for (;;) { break; }"
                ),
                (statement) => {
                    const source = [
                        "declare const condition: boolean;",
                        "declare const value: number;",
                        statement,
                    ].join("\n");
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

ruleTester.run("no-restricted-syntax", getNoRestrictedSyntaxRuleFromPlugin(), {
    invalid: [
        {
            code: "if (x) { y(); }",
            errors: [{ messageId: "forbidden" }],
            options: [{ selectors: ["IfStatement"] }],
        },
        {
            code: "while (true) { break; }",
            errors: [{ messageId: "customMessage" }],
            options: [
                {
                    selectors: [
                        {
                            message: "No while loops",
                            selector: "WhileStatement",
                        },
                    ],
                },
            ],
        },
        {
            code: "if (x) { y(); }",
            errors: [{ messageId: "forbidden" }],
            options: [
                {
                    selectors: [
                        {
                            selector: "IfStatement",
                        },
                    ],
                },
            ],
        },
        {
            code: "if (x) { y(); } while (x) { break; }",
            errors: [
                { messageId: "forbidden" },
                { messageId: "customMessage" },
            ],
            options: [
                {
                    selectors: [
                        "IfStatement",
                        {
                            message: "No while loops",
                            selector: "WhileStatement",
                        },
                    ],
                },
            ],
        },
        {
            code: readFixture(),
            errors: [
                { messageId: "forbidden" },
                { messageId: "forbidden" },
                { messageId: "customMessage" },
            ],
            options: [
                {
                    selectors: [
                        "IfStatement",
                        "WhileStatement",
                        {
                            message: "No switch statements",
                            selector: "SwitchStatement",
                        },
                    ],
                },
            ],
        },
    ],
    valid: [
        {
            code: "for (;;) { break; }",
            options: [{ selectors: ["IfStatement"] }],
        },
        {
            code: "if (x) { y(); }",
            options: [{}],
        },
        {
            code: "if (x) { y(); }",
            options: [{ selectors: [] }],
        },
        {
            code: "const value = 1;",
        },
        {
            code: readFixture(),
            options: [
                {
                    selectors: ["TryStatement"],
                },
            ],
        },
    ],
});
