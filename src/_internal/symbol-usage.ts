import type { TSESTree as es } from "@typescript-eslint/utils";

import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";

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
    parent?.type === "ExportSpecifier" ||
    parent?.type === "ImportDefaultSpecifier" ||
    parent?.type === "ImportNamespaceSpecifier" ||
    parent?.type === "ImportSpecifier";

/**
 * Whether an identifier is the declaration identifier for supported node types.
 */
export const isDeclarationIdentifier = (
    node: Readonly<es.Identifier>
): boolean => {
    const { parent } = node;
    if (parent === undefined) {
        return false;
    }

    if (
        parent.type === "TSInterfaceDeclaration" ||
        parent.type === "TSTypeAliasDeclaration"
    ) {
        return parent.id === node;
    }

    if (
        parent.type === "ClassDeclaration" ||
        parent.type === "FunctionDeclaration" ||
        parent.type === "TSDeclareFunction" ||
        parent.type === "TSEnumDeclaration"
    ) {
        return parent.id === node;
    }

    if (parent.type === "VariableDeclarator") {
        return parent.id === node;
    }

    return false;
};

const normalizeTagComment = (
    text: readonly JsDocTagTextPart[] | string | undefined
): string | undefined => {
    if (text === undefined) {
        return undefined;
    }

    if (typeof text === "string") {
        const normalized = text.trim().replaceAll(/\s+/gu, " ");
        return normalized.length > 0 ? normalized : undefined;
    }

    const normalized = text
        .map((part) => part.text)
        .join("")
        .replaceAll(/\s+/gu, " ")
        .trim();

    return normalized.length > 0 ? normalized : undefined;
};

const isSymbolWithJsDocTags = (
    symbol: unknown
): symbol is SymbolWithJsDocTags => {
    if (typeof symbol !== "object" || symbol === null) {
        return false;
    }

    if (!("getJsDocTags" in symbol)) {
        return false;
    }

    return typeof symbol.getJsDocTags === "function";
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

    return symbol
        .getJsDocTags(checker)
        .filter((tag) => tag.name === tagName)
        .map((tag) => normalizeTagComment(tag.text));
};

/**
 * Return true when text matches any compiled regex pattern.
 */
export const matchesAnyPattern = (
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
    if (symbolFromLocation !== undefined) {
        return symbolFromLocation;
    }

    return getConstrainedTypeAtLocation(parserServices, node).getSymbol();
};
