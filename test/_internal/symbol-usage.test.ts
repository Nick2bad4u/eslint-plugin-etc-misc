import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import {
    getIdentifierSymbol,
    getJsDocTagComments,
    isDeclarationIdentifier,
    isImportOrExportSpecifier,
    matchesAnyPattern,
} from "../../src/_internal/symbol-usage";

describe("symbol-usage helpers", () => {
    it("detects import/export specifier parent nodes", () => {
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ImportSpecifier,
            } as es.Node)
        ).toBeTruthy();
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ImportDefaultSpecifier,
            } as es.Node)
        ).toBeTruthy();
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ImportNamespaceSpecifier,
            } as es.Node)
        ).toBeTruthy();
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.ExportSpecifier,
            } as es.Node)
        ).toBeTruthy();
        expect(
            isImportOrExportSpecifier({
                type: AST_NODE_TYPES.Identifier,
            } as es.Node)
        ).toBeFalsy();
        expect(isImportOrExportSpecifier(undefined)).toBeFalsy();
    });

    it("detects declaration identifiers across supported declaration node types", () => {
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

        expect(isDeclarationIdentifier(tsInterfaceIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(tsTypeAliasIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(classIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(functionIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(declareFunctionIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(tsEnumIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(variableIdentifier)).toBeTruthy();
        expect(isDeclarationIdentifier(nonDeclarationIdentifier)).toBeFalsy();
        expect(isDeclarationIdentifier(withoutParentIdentifier)).toBeFalsy();
    });

    it("extracts and normalizes JSDoc tag comments", () => {
        const comments = getJsDocTagComments(
            {
                getJsDocTags: () => [
                    { name: "internal", text: "  keep   this  " },
                    {
                        name: "internal",
                        text: [{ text: " part " }, { text: " value " }],
                    },
                    { name: "internal", text: "   " },
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
        expect(
            getJsDocTagComments(undefined, undefined, "internal")
        ).toStrictEqual([]);
        expect(getJsDocTagComments({}, undefined, "internal")).toStrictEqual(
            []
        );
    });

    it("matches text against any provided regex pattern", () => {
        expect(matchesAnyPattern("MySymbol", [/^My/v, /Other$/v])).toBeTruthy();
        expect(
            matchesAnyPattern("MySymbol", [/^Other/v, /Else$/v])
        ).toBeFalsy();
    });

    it("returns symbol from parserServices location lookup when available", () => {
        const expectedSymbol = { getName: () => "Example" };

        const parserServices = {
            getSymbolAtLocation: () => expectedSymbol,
        } as unknown as Parameters<typeof getIdentifierSymbol>[0];

        expect(
            getIdentifierSymbol(parserServices, {} as es.Identifier)
        ).toStrictEqual(expectedSymbol);
    });
});
