import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import pluginExport from "../plugin.mjs";
import { pluginMeta } from "../src/_internal/plugin-meta";
import { configs } from "../src/configs";
import { rules } from "../src/rules";

const plugin = pluginExport;
const requireCommonJsModule: (specifier: string) => unknown = createRequire(
    import.meta.url
);

const readPluginEntrypointSource = (): string =>
    readFileSync("plugin.mjs", "utf8");

const parsePluginEntrypoint = (): TSESTree.Program =>
    parser.parseForESLint(readPluginEntrypointSource(), {
        ecmaVersion: "latest",
        filePath: "plugin.mjs",
        sourceType: "module",
    }).ast;

const assertImportDeclaration = (
    statement: Readonly<TSESTree.Statement> | undefined
): TSESTree.ImportDeclaration => {
    expect(statement?.type).toBe(AST_NODE_TYPES.ImportDeclaration);

    if (statement?.type !== AST_NODE_TYPES.ImportDeclaration) {
        throw new TypeError("Expected import declaration.");
    }

    return statement;
};

const assertVariableDeclaration = (
    statement: Readonly<TSESTree.Statement> | undefined
): TSESTree.VariableDeclaration => {
    expect(statement?.type).toBe(AST_NODE_TYPES.VariableDeclaration);

    if (statement?.type !== AST_NODE_TYPES.VariableDeclaration) {
        throw new TypeError("Expected variable declaration.");
    }

    return statement;
};

const assertPluginDeclarator = (
    statement: Readonly<TSESTree.VariableDeclaration>
): Readonly<{ id: TSESTree.Identifier; init: TSESTree.ObjectExpression }> => {
    const declarator = statement.declarations[0];
    const initializer = declarator?.init;
    const identifier = declarator?.id;

    expect(identifier?.type).toBe(AST_NODE_TYPES.Identifier);
    expect(initializer?.type).toBe(AST_NODE_TYPES.ObjectExpression);

    if (
        identifier?.type !== AST_NODE_TYPES.Identifier ||
        initializer?.type !== AST_NODE_TYPES.ObjectExpression
    ) {
        throw new TypeError("Expected plugin object declaration.");
    }

    return {
        id: identifier,
        init: initializer,
    };
};

const assertSpreadIdentifier = (
    declaration: Readonly<TSESTree.ObjectExpression>
): TSESTree.Identifier => {
    const spreadProperty = declaration.properties[0];

    expect(spreadProperty?.type).toBe(AST_NODE_TYPES.SpreadElement);

    if (
        spreadProperty?.type !== AST_NODE_TYPES.SpreadElement ||
        spreadProperty.argument.type !== AST_NODE_TYPES.Identifier
    ) {
        throw new TypeError("Expected spread property with builtPlugin.");
    }

    return spreadProperty.argument;
};

const assertExportDefaultDeclaration = (
    statement: Readonly<TSESTree.Statement> | undefined
): TSESTree.ExportDefaultDeclaration => {
    expect(statement?.type).toBe(AST_NODE_TYPES.ExportDefaultDeclaration);

    if (statement?.type !== AST_NODE_TYPES.ExportDefaultDeclaration) {
        throw new TypeError("Expected export default declaration.");
    }

    return statement;
};

const assertDefaultExportIdentifier = (
    statement: Readonly<TSESTree.ExportDefaultDeclaration>
): TSESTree.Identifier => {
    const { declaration } = statement;

    expect(declaration.type).toBe(AST_NODE_TYPES.Identifier);

    if (declaration.type !== AST_NODE_TYPES.Identifier) {
        throw new TypeError("Expected default export identifier.");
    }

    return declaration;
};

describe("plugin.mjs entrypoint", () => {
    it("loads the advertised CommonJS entrypoint", () => {
        expect.hasAssertions();

        const commonJsPlugin = requireCommonJsModule("../dist/plugin.cjs");

        expect(commonJsPlugin).toMatchObject({
            meta: pluginMeta,
        });
        expect(commonJsPlugin).toHaveProperty("rules.default-case");
        expect(commonJsPlugin).toHaveProperty("rules.require-usememo");
        expect(commonJsPlugin).toHaveProperty(
            "configs.all.rules.etc-misc/default-case"
        );
    });

    it("re-exports the built plugin with the same nested plugin references", () => {
        expect.hasAssertions();
        expect(plugin.meta).toStrictEqual(pluginMeta);
        expect(plugin.processors).toStrictEqual({});
        expect(Object.keys(plugin.rules)).toStrictEqual(Object.keys(rules));

        const configVariants = [
            "all",
            "allStrict",
            "minimal",
            "recommended",
            "strict",
            "strictTypeChecked",
        ] as const;

        for (const configVariant of configVariants) {
            expect(plugin.configs[configVariant].rules).toStrictEqual(
                configs[configVariant].rules
            );
            expect(plugin.configs[configVariant].name).toBe(
                configs[configVariant].name
            );
            expect(
                plugin.configs[configVariant].plugins["etc-misc"].meta
            ).toStrictEqual(plugin.meta);
            expect(
                plugin.configs[configVariant].plugins["etc-misc"].rules
            ).toBe(plugin.rules);
            expect(
                "etc-misc/typescript/no-unsafe-object-assignment" in
                    plugin.configs[configVariant].rules
            ).toBe(false);
        }

        expect(
            plugin.rules["typescript/no-unsafe-object-assignment"]
        ).toBeDefined();
        expect(
            plugin.rules["typescript/no-unsafe-object-assign"]?.meta.deprecated
        ).toBe(false);
        expect(
            plugin.rules["typescript/no-unsafe-object-assignment"]?.meta
                .deprecated
        ).toMatchObject({
            deprecatedSince: "1.2.0",
            replacedBy: [
                {
                    rule: {
                        name: "typescript/no-unsafe-object-assign",
                    },
                },
            ],
        });

        expect(plugin.configs.strictTypeChecked.languageOptions).toStrictEqual(
            configs.strictTypeChecked.languageOptions
        );
        expect(
            plugin.configs.strictTypeChecked.languageOptions?.parserOptions
                ?.projectService
        ).toBe(true);
    });

    it("keeps the entrypoint module structure stable", () => {
        expect.hasAssertions();

        const ast = parsePluginEntrypoint();

        const importNode = assertImportDeclaration(ast.body[0]);

        expect(importNode.source.value).toBe("./dist/plugin.js");

        const variableNode = assertVariableDeclaration(ast.body[1]);

        const pluginDeclarator = assertPluginDeclarator(variableNode);

        expect(pluginDeclarator.id.name).toBe("plugin");

        const spreadIdentifier = assertSpreadIdentifier(pluginDeclarator.init);

        expect(spreadIdentifier.name).toBe("builtPlugin");

        const exportNode = assertExportDefaultDeclaration(ast.body[2]);
        const defaultExportIdentifier =
            assertDefaultExportIdentifier(exportNode);

        expect(defaultExportIdentifier.name).toBe("plugin");
    });

    it("maps every all-config rule key back to a real exported rule", () => {
        expect.hasAssertions();

        const allConfigRuleEntries = Object.entries(plugin.configs.all.rules);

        fc.assert(
            fc.property(
                fc.constantFrom(...allConfigRuleEntries),
                ([qualifiedRuleName, severity]) => {
                    expect(severity === "error" || severity === "warn").toBe(
                        true
                    );
                    expect(qualifiedRuleName.startsWith("etc-misc/")).toBe(
                        true
                    );

                    const shortRuleName = qualifiedRuleName.slice(
                        "etc-misc/".length
                    );

                    const ruleModule = plugin.rules[shortRuleName];

                    expect(ruleModule).toBeDefined();

                    if (ruleModule === undefined) {
                        throw new TypeError(
                            `Expected exported rule for ${qualifiedRuleName}.`
                        );
                    }

                    const expectedSeverity = (() => {
                        if (ruleModule.meta.deprecated === false) {
                            return ruleModule.meta.type === "problem"
                                ? "error"
                                : "warn";
                        }

                        return "warn";
                    })();

                    expect(severity).toBe(expectedSeverity);
                }
            )
        );
    });
});
