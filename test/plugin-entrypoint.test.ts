import type { TSESTree } from "@typescript-eslint/utils";

import parser from "@typescript-eslint/parser";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import * as fc from "fast-check";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import pluginExport from "../plugin.mjs";
import { pluginMeta } from "../src/_internal/plugin-meta";
import { configs } from "../src/configs";
import { rules } from "../src/rules";

const plugin = pluginExport;

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
    it("re-exports the built plugin with the same nested plugin references", () => {
        expect(plugin.meta).toEqual(pluginMeta);
        expect(plugin.processors).toEqual({});

        expect(Object.keys(plugin.rules)).toEqual(Object.keys(rules));
        expect(plugin.configs.allStrict.rules).toEqual(configs.allStrict.rules);
        expect(plugin.configs.all.rules).toEqual(configs.all.rules);
        expect(plugin.configs.minimal.rules).toEqual(configs.minimal.rules);
        expect(plugin.configs.recommended.rules).toEqual(
            configs.recommended.rules
        );
        expect(plugin.configs.strict.rules).toEqual(configs.strict.rules);
        expect(plugin.configs.strictTypeChecked.rules).toEqual(
            configs.strictTypeChecked.rules
        );
        expect(plugin.configs.strictTypeChecked.languageOptions).toEqual(
            configs.strictTypeChecked.languageOptions
        );

        const allStrictPluginReference =
            plugin.configs.allStrict.plugins["etc-misc"];
        const allPluginReference = plugin.configs.all.plugins["etc-misc"];
        const minimalPluginReference =
            plugin.configs.minimal.plugins["etc-misc"];
        const recommendedPluginReference =
            plugin.configs.recommended.plugins["etc-misc"];
        const strictPluginReference = plugin.configs.strict.plugins["etc-misc"];
        const strictTypeCheckedPluginReference =
            plugin.configs.strictTypeChecked.plugins["etc-misc"];

        expect(allStrictPluginReference.meta).toEqual(plugin.meta);
        expect(allPluginReference.meta).toEqual(plugin.meta);
        expect(minimalPluginReference.meta).toEqual(plugin.meta);
        expect(recommendedPluginReference.meta).toEqual(plugin.meta);
        expect(strictPluginReference.meta).toEqual(plugin.meta);
        expect(strictTypeCheckedPluginReference.meta).toEqual(plugin.meta);

        expect(allStrictPluginReference.rules).toBe(plugin.rules);
        expect(allPluginReference.rules).toBe(plugin.rules);
        expect(minimalPluginReference.rules).toBe(plugin.rules);
        expect(recommendedPluginReference.rules).toBe(plugin.rules);
        expect(strictPluginReference.rules).toBe(plugin.rules);
        expect(strictTypeCheckedPluginReference.rules).toBe(plugin.rules);
        expect(
            plugin.configs.strictTypeChecked.languageOptions?.parserOptions
                ?.projectService
        ).toBeTruthy();
    });

    it("keeps the entrypoint module structure stable", () => {
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
        const allConfigRuleEntries = Object.entries(plugin.configs.all.rules);

        fc.assert(
            fc.property(
                fc.constantFrom(...allConfigRuleEntries),
                ([qualifiedRuleName, severity]) => {
                    expect(
                        severity === "error" || severity === "warn"
                    ).toBeTruthy();
                    expect(
                        qualifiedRuleName.startsWith("etc-misc/")
                    ).toBeTruthy();

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
