import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/no-param-reassign.fixture.ts";

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

const getNoParamReassignRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["no-param-reassign"]
> => {
    const ruleModule = plugin.rules["no-param-reassign"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'no-param-reassign' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("no-param-reassign fixture structure", () => {
    it("contains identifier/member assignments and identifier/member updates", () => {
        expect.hasAssertions();

        const nodes = collectNodes(parseFixtureProgram());

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.AssignmentExpression &&
                    node.left.type === AST_NODE_TYPES.Identifier
            )
        ).toBe(true);

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.AssignmentExpression &&
                    node.left.type === AST_NODE_TYPES.MemberExpression
            )
        ).toBe(true);

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.UpdateExpression &&
                    node.argument.type === AST_NODE_TYPES.Identifier
            )
        ).toBe(true);

        expect(
            nodes.some(
                (node) =>
                    node.type === AST_NODE_TYPES.UpdateExpression &&
                    node.argument.type === AST_NODE_TYPES.MemberExpression
            )
        ).toBe(true);
    });

    it("parses generated parameter-reassignment snippets from fast-check", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(
                fc.constantFrom("alpha", "beta", "value", "param"),
                fc.constantFrom("add", "inc"),
                (parameterName, mutationKind) => {
                    const mutation =
                        mutationKind === "add"
                            ? `${parameterName} += 1;`
                            : `${parameterName}++;`;
                    const source = [
                        "const sideEffect = (..._args: readonly unknown[]): void => {};",
                        `function generated(${parameterName}: number): void {`,
                        "    sideEffect();",
                        `    ${mutation}`,
                        "}",
                    ].join("\n");

                    const ast = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const declaration = ast.body[1];

                    expect(declaration?.type).toBe(
                        AST_NODE_TYPES.FunctionDeclaration
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

ruleTester.run("no-param-reassign", getNoParamReassignRuleFromPlugin(), {
    invalid: [
        {
            code: "function f(value) { sideEffect(); value += 1; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const fn = (value) => (value += 1);",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "const fn = (value) => { sideEffect(); value++; };",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: "function f(value) { if (value > 0) { sideEffect(); } value += 1; }",
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "function f(value) {",
                "    const mutate = (): void => {",
                "        sideEffect();",
                "        value += 1;",
                "    };",
                "",
                "    mutate();",
                "}",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: readFixture(),
            errors: [{ messageId: "forbidden" }, { messageId: "forbidden" }],
        },
    ],
    valid: [
        {
            code: "const fn = (value) => { value++; };",
        },
        {
            code: "function f(value) { value += 1; sideEffect(); }",
        },
        {
            code: "function f(value) { let copy = value; sideEffect(); copy += 1; return copy; }",
        },
        {
            code: "function f(value) { sideEffect(); value.count = 1; }",
        },
        {
            code: "function f(value) { sideEffect(); value.count++; }",
        },
        {
            code: [
                "function f(value) {",
                "    const mutate = (): void => {",
                "        sideEffect();",
                "        missingVariable += 1;",
                "    };",
                "",
                "    mutate();",
                "    return value;",
                "}",
            ].join("\n"),
        },
    ],
});
