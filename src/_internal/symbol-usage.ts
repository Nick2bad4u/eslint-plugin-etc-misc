import type { TSESTree as es } from "@typescript-eslint/utils";
import type { UnknownRecord } from "type-fest";

import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayJoin, isDefined, keyIn } from "ts-extras";

type JsDocTagInfo = Readonly<{
    readonly name: string;
    readonly text?: readonly JsDocTagTextPart[] | string;
}>;

type JsDocTagTextPart = Readonly<{ readonly text: string }>;

type ParserServices = Readonly<
    Parameters<typeof getConstrainedTypeAtLocation>[0]
>;

type SymbolWithJsDocTags = Readonly<{
    readonly getJsDocTags: (checker?: unknown) => readonly JsDocTagInfo[];
}>;

/**
 * Whether an identifier belongs to an import/export specifier position.
 */
export const isImportOrExportSpecifier = (
    parent: Readonly<es.Node> | undefined
): boolean =>
    parent?.type === AST_NODE_TYPES.ExportSpecifier ||
    parent?.type === AST_NODE_TYPES.ImportDefaultSpecifier ||
    parent?.type === AST_NODE_TYPES.ImportNamespaceSpecifier ||
    parent?.type === AST_NODE_TYPES.ImportSpecifier;

/**
 * Whether an identifier is the declaration identifier for supported node types.
 */
export const isDeclarationIdentifier = (
    node: Readonly<es.Identifier>
): boolean => {
    const { parent } = node;
    if (!isDefined(parent)) {
        return false;
    }

    if (
        parent.type === AST_NODE_TYPES.TSInterfaceDeclaration ||
        parent.type === AST_NODE_TYPES.TSTypeAliasDeclaration
    ) {
        return parent.id === node;
    }

    if (
        parent.type === AST_NODE_TYPES.ClassDeclaration ||
        parent.type === AST_NODE_TYPES.FunctionDeclaration ||
        parent.type === AST_NODE_TYPES.TSDeclareFunction ||
        parent.type === AST_NODE_TYPES.TSEnumDeclaration
    ) {
        return parent.id === node;
    }

    if (parent.type === AST_NODE_TYPES.VariableDeclarator) {
        return parent.id === node;
    }

    return false;
};

const normalizeTagComment = (
    text:
        | readonly JsDocTagTextPart[]
        | string
        | undefined
): string | undefined => {
    if (!isDefined(text)) {
        return undefined;
    }

    if (typeof text === "string") {
        const normalized = text.trim().replaceAll(/\s+/gv, " ");
        return normalized.length > 0 ? normalized : undefined;
    }

    const normalized = arrayJoin(
        text.map((part) => part.text),
        ""
    )
        .replaceAll(/\s+/gv, " ")
        .trim();

    return normalized.length > 0 ? normalized : undefined;
};

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const isSymbolWithJsDocTags = (
    symbol: unknown
): symbol is SymbolWithJsDocTags => {
    if (!isUnknownRecord(symbol)) {
        return false;
    }

    if (!keyIn(symbol, "getJsDocTags")) {
        return false;
    }

    return typeof symbol["getJsDocTags"] === "function";
};

/**
 * Collect normalized comment payloads for a specific JSDoc tag name.
 */
export const getJsDocTagComments = (
    symbol: unknown,
    checker: unknown,
    tagName: string
): readonly (string | undefined)[] => {
    if (!isSymbolWithJsDocTags(symbol)) {
        return [];
    }

    const tags = symbol.getJsDocTags();
    const resolvedTags = tags.length > 0 ? tags : symbol.getJsDocTags(checker);

    return resolvedTags
        .filter((tag) => tag.name === tagName)
        .map((tag) => normalizeTagComment(tag.text));
};

/**
 * Return true when text matches any compiled regex pattern.
 */
export const hasAnyPatternMatch = (
    text: string,
    patterns: readonly Readonly<RegExp>[]
): boolean => patterns.some((pattern) => pattern.test(text));

/**
 * Resolve the symbol at identifier location, falling back to constrained type.
 */
export const getIdentifierSymbol = (
    parserServices: ParserServices,
    node: Readonly<es.Identifier>
): ReturnType<ParserServices["getSymbolAtLocation"]> | undefined => {
    const symbolFromLocation = parserServices.getSymbolAtLocation(node);
    if (isDefined(symbolFromLocation)) {
        return symbolFromLocation;
    }

    return getConstrainedTypeAtLocation(parserServices, node).getSymbol();
};
