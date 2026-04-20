import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/sort-class-members.fixture.ts";

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

const collectClassBodies = (
    program: TSESTree.Program
): readonly TSESTree.ClassBody[] => {
    const classBodies: TSESTree.ClassBody[] = [];
    const stack: TSESTree.Node[] = [...program.body];

    while (stack.length > 0) {
        const node = stack.pop();

        if (node !== undefined) {
            if (node.type === AST_NODE_TYPES.ClassBody) {
                classBodies.push(node);
            }

            for (const value of Object.values(node)) {
                stack.push(...toChildNodes(value));
            }
        }
    }

    return classBodies;
};

const getSortClassMembersRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["sort-class-members"]
> => {
    const ruleModule = plugin.rules["sort-class-members"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'sort-class-members' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("sort-class-members fixture structure", () => {
    it("contains class members that exercise identifier, literal, and skipped keys", () => {
        expect.hasAssertions();

        const classBodies = collectClassBodies(parseFixtureProgram());

        expect(
            classBodies.some((classBody) =>
                classBody.body.some(
                    (member) =>
                        member.type === AST_NODE_TYPES.MethodDefinition &&
                        member.key.type === AST_NODE_TYPES.Literal
                )
            )
        ).toBeTruthy();

        expect(
            classBodies.some((classBody) =>
                classBody.body.some(
                    (member) =>
                        member.type === AST_NODE_TYPES.MethodDefinition &&
                        member.computed
                )
            )
        ).toBeTruthy();

        expect(
            classBodies.some((classBody) =>
                classBody.body.some(
                    (member) =>
                        member.type === AST_NODE_TYPES.PropertyDefinition &&
                        member.key.type === AST_NODE_TYPES.PrivateIdentifier
                )
            )
        ).toBeTruthy();
    });

    it("parses generated sorted class member snippets from fast-check", () => {
        expect.hasAssertions();

        fc.assert(
            fc.property(
                fc
                    .uniqueArray(
                        fc.constantFrom(
                            "alpha",
                            "beta",
                            "delta",
                            "epsilon",
                            "gamma"
                        ),
                        {
                            maxLength: 4,
                            minLength: 2,
                        }
                    )
                    .map((names) =>
                        // eslint-disable-next-line unicorn/no-array-sort -- Node.js test runtime includes versions without Array#toSorted.
                        [...names].sort((left, right) =>
                            left.localeCompare(right)
                        )
                    ),
                (memberNames) => {
                    const members = memberNames
                        .map((memberName) => `${memberName}() {}`)
                        .join(" ");
                    const source = `class Example { ${members} }`;
                    const ast = parser.parseForESLint(source, {
                        ecmaVersion: "latest",
                        sourceType: "module",
                    }).ast;

                    const statement = ast.body[0];

                    expect(statement?.type).toBe(
                        AST_NODE_TYPES.ClassDeclaration
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

ruleTester.run("sort-class-members", getSortClassMembersRuleFromPlugin(), {
    invalid: [
        {
            code: "class Example { z() {} a() {} }",
            errors: [{ messageId: "incorrectSortingOrder" }],
        },
        {
            code: "class Example { 'zeta'() {} 'alpha'() {} }",
            errors: [{ messageId: "incorrectSortingOrder" }],
        },
        {
            code: "class Example { [Symbol.iterator]() {} b() {} a() {} }",
            errors: [{ messageId: "incorrectSortingOrder" }],
        },
        {
            code: readFixture(),
            errors: Array.from({ length: 2 }, () => ({
                messageId: "incorrectSortingOrder",
            })),
        },
    ],
    valid: [
        {
            code: "class Example { a() {} z() {} }",
        },
        {
            code: "class Example { 'alpha'() {} 'zeta'() {} }",
        },
        {
            code: "class Example { [Symbol.iterator]() {} a() {} b() {} }",
        },
        {
            code: "class Example { #z = 1; a() {} b() {} }",
        },
    ],
});
