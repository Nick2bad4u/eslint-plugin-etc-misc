import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import plugin from "../../src/plugin";
import { ruleTester } from "../_internal/ruleTester";

const fixturePath = "test/fixtures/internal/no-internal.fixture.ts";

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

const getNoInternalRuleFromPlugin = (): NonNullable<
    (typeof plugin.rules)["no-internal"]
> => {
    const ruleModule = plugin.rules["no-internal"];

    if (ruleModule === undefined) {
        throw new TypeError(
            "Rule 'no-internal' was not found in plugin export."
        );
    }

    return ruleModule;
};

describe("no-internal fixture parser shape", () => {
    it("contains import/export specifiers and internal declarations used in rule scenarios", () => {
        const program = parseFixtureProgram();
        const nodes = collectNodes(program);

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.ImportSpecifier)
        ).toBeTruthy();

        expect(
            nodes.some((node) => node.type === AST_NODE_TYPES.ExportSpecifier)
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.TSInterfaceDeclaration
            )
        ).toBeTruthy();

        expect(
            program.body.some(
                (statement) =>
                    statement.type === AST_NODE_TYPES.TSDeclareFunction
            )
        ).toBeTruthy();
    });

    it("parses generated internal API snippets from fast-check", () => {
        fc.assert(
            fc.property(
                fc.constantFrom(
                    "AlphaInternal",
                    "BetaInternal",
                    "GammaInternal"
                ),
                fc.constantFrom(
                    "@internal",
                    "@internal Internal detail",
                    "@internal    spaced     detail"
                ),
                (name, tag) => {
                    const source = [
                        "/**",
                        ` * ${tag}`,
                        " */",
                        `declare function ${name}(): void;`,
                        `${name}();`,
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

ruleTester.run("no-internal", getNoInternalRuleFromPlugin(), {
    invalid: [
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
                "const item: InternalType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            errors: [{ messageId: "forbidden" }],
        },
        {
            code: [
                "/** @internal Internal function details */",
                "declare function internalFunction(): void;",
                "internalFunction();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "Internal function details",
                        name: "internalFunction",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "/**",
                " * @internal First reason",
                " * @internal Second reason",
                " */",
                "declare function internalWithMultipleTags(): void;",
                "internalWithMultipleTags();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        comment: "First reason",
                        name: "internalWithMultipleTags",
                    },
                    messageId: "forbiddenWithComment",
                },
                {
                    data: {
                        comment: "Second reason",
                        name: "internalWithMultipleTags",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "/**",
                " * @internal",
                " * @internal with detail",
                " */",
                "declare function mixedInternalTags(): void;",
                "mixedInternalTags();",
            ].join("\n"),
            errors: [
                {
                    data: {
                        name: "mixedInternalTags",
                    },
                    messageId: "forbidden",
                },
                {
                    data: {
                        comment: "with detail",
                        name: "mixedInternalTags",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: readFixture(),
            errors: [
                {
                    data: {
                        name: "InternalModel",
                    },
                    messageId: "forbidden",
                },
                {
                    data: {
                        name: "InternalModel",
                    },
                    messageId: "forbidden",
                },
                {
                    data: {
                        comment: "Fixture reason for internal API",
                        name: "internalFromFixture",
                    },
                    messageId: "forbiddenWithComment",
                },
            ],
        },
        {
            code: [
                "interface PublicType {",
                "  readonly value: number;",
                "}",
                "const item: PublicType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            errors: [
                {
                    data: {
                        pattern: "[",
                    },
                    messageId: "invalidIgnorePattern",
                },
            ],
            options: [
                {
                    ignored: {
                        "[": "name",
                    },
                },
            ],
        },
        {
            code: "const value = 1; void value;",
            errors: [
                {
                    data: {
                        pattern: "[",
                    },
                    messageId: "invalidIgnorePattern",
                },
            ],
            options: [
                {
                    ignored: {
                        "[": "path",
                    },
                },
            ],
        },
    ],
    valid: [
        {
            code: [
                "interface PublicType {",
                "  readonly value: number;",
                "}",
                "const item: PublicType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
        },
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
            ].join("\n"),
        },
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
                "const item: InternalType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            options: [
                {
                    ignored: {
                        "^InternalType$": "name",
                    },
                },
            ],
        },
        {
            code: [
                "/** @internal */",
                "interface InternalType {",
                "  readonly value: number;",
                "}",
                "const item: InternalType = { value: 42 };",
                "console.log(item.value);",
            ].join("\n"),
            options: [
                {
                    ignored: {
                        InternalType: "path",
                    },
                },
            ],
        },
        {
            code: [
                'import { readFileSync as readFile } from "node:fs";',
                "export { readFile };",
            ].join("\n"),
        },
        {
            code: [
                "declare const present: number;",
                "void present;",
                "void missingReference;",
            ].join("\n"),
        },
    ],
});
