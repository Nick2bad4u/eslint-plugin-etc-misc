import type { TSESTree as es } from "@typescript-eslint/utils";
import type { UnknownRecord } from "type-fest";

import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
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
    if (!isDefined(text)) {
        return undefined;
    }

    if (typeof text === "string") {
        const normalized = text.trim().replaceAll(/\s+/gu, " ");
        return normalized.length > 0 ? normalized : undefined;
    }

    const normalized = arrayJoin(
        text.map((part) => part.text),
        ""
    )
        .replaceAll(/\s+/gu, " ")
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
    if (isDefined(symbolFromLocation)) {
        return symbolFromLocation;
    }

    return getConstrainedTypeAtLocation(parserServices, node).getSymbol();
};
