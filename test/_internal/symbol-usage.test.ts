import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import {
    getIdentifierSymbol,
    getJsDocTagComments,
    hasAnyPatternMatch,
    isDeclarationIdentifier,
    isImportOrExportSpecifier,
} from "../../src/_internal/symbol-usage";

describe("symbol-usage helpers", () => {
    it("detects import/export specifier parent nodes", () => {
        expect.hasAssertions();
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ImportSpecifier,
            } as es.Node)
        ).toBe(true);
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ImportDefaultSpecifier,
            } as es.Node)
        ).toBe(true);
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ImportNamespaceSpecifier,
            } as es.Node)
        ).toBe(true);
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ExportSpecifier,
            } as es.Node)
        ).toBe(true);
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.Identifier,
            } as es.Node)
        ).toBe(false);
        expect(isImportOrExportSpecifier(undefined)).toBe(false);
    });

    it("detects declaration identifiers across supported declaration node types", () => {
        expect.hasAssertions();

        const tsInterfaceIdentifier = {} as es.Identifier;
        tsInterfaceIdentifier.parent = {
            id: tsInterfaceIdentifier,
            type: AST_NODE_TYPES.TSInterfaceDeclaration,
        } as es.Node;

        const tsTypeAliasIdentifier = {} as es.Identifier;
        tsTypeAliasIdentifier.parent = {
            id: tsTypeAliasIdentifier,
            type: AST_NODE_TYPES.TSTypeAliasDeclaration,
        } as es.Node;

        const classIdentifier = {} as es.Identifier;
        classIdentifier.parent = {
            id: classIdentifier,
            type: AST_NODE_TYPES.ClassDeclaration,
        } as es.Node;

        const functionIdentifier = {} as es.Identifier;
        functionIdentifier.parent = {
            id: functionIdentifier,
            type: AST_NODE_TYPES.FunctionDeclaration,
        } as es.Node;

        const declareFunctionIdentifier = {} as es.Identifier;
        declareFunctionIdentifier.parent = {
            id: declareFunctionIdentifier,
            type: AST_NODE_TYPES.TSDeclareFunction,
        } as es.Node;

        const tsEnumIdentifier = {} as es.Identifier;
        tsEnumIdentifier.parent = {
            id: tsEnumIdentifier,
            type: AST_NODE_TYPES.TSEnumDeclaration,
        } as es.Node;

        const variableIdentifier = {} as es.Identifier;
        variableIdentifier.parent = {
            id: variableIdentifier,
            type: AST_NODE_TYPES.VariableDeclarator,
        } as es.Node;

        const nonDeclarationIdentifier = {} as es.Identifier;
        nonDeclarationIdentifier.parent = {
            type: AST_NODE_TYPES.MemberExpression,
        } as es.Node;

        const withoutParentIdentifier = {} as es.Identifier;

        expect(isDeclarationIdentifier(tsInterfaceIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(tsTypeAliasIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(classIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(functionIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(declareFunctionIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(tsEnumIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(variableIdentifier)).toBe(true);
        expect(isDeclarationIdentifier(nonDeclarationIdentifier)).toBe(false);
        expect(isDeclarationIdentifier(withoutParentIdentifier)).toBe(false);
    });

    it("extracts and normalizes JSDoc tag comments", () => {
        expect.hasAssertions();

        const comments = getJsDocTagComments(
            {
                getJsDocTags: () => [
                    { name: "internal", text: "  keep   this  " },
                    {
                        name: "internal",
                        text: [{ text: " part " }, { text: " value " }],
                    },
                    { name: "internal", text: " ".repeat(3) },
                    { name: "deprecated", text: "ignore" },
                    { name: "internal" },
                ],
            },
            undefined,
            "internal"
        );

        expect(comments).toStrictEqual([
            "keep this",
            "part value",
            undefined,
            undefined,
        ]);
    });

    it("returns no JSDoc comments for non-symbol values", () => {
        expect.hasAssertions();
        expect(
            getJsDocTagComments(undefined, undefined, "internal")
        ).toStrictEqual([]);
        expect(getJsDocTagComments({}, undefined, "internal")).toStrictEqual(
            []
        );
    });

    it("matches text against any provided regex pattern", () => {
        expect.hasAssertions();
        expect(hasAnyPatternMatch("MySymbol", [/^My/v, /Other$/v])).toBe(true);
        expect(hasAnyPatternMatch("MySymbol", [/^Other/v, /Else$/v])).toBe(
            false
        );
    });

    it("returns symbol from parserServices location lookup when available", () => {
        expect.hasAssertions();

        const expectedSymbol = { getName: () => "Example" };

        const parserServices = {
            getSymbolAtLocation: () => expectedSymbol,
        } as unknown as Parameters<typeof getIdentifierSymbol>[0];

        expect(
            getIdentifierSymbol(parserServices, {} as es.Identifier)
        ).toStrictEqual(expectedSymbol);
    });
});
