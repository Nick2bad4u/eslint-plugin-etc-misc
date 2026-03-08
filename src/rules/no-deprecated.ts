import type { TSESTree as es } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type IgnoreMode = "name" | "path";

type IgnorePatterns = Readonly<{
    name: readonly RegExp[];
    path: readonly RegExp[];
}>;

type JsDocTagInfo = Readonly<{
    name: string;
    text?: readonly SymbolDisplayPart[] | string;
}>;

type MessageIds = "forbidden" | "forbiddenWithComment";

type Options = readonly [
    {
        ignored?: Record<string, IgnoreMode>;
    }?,
];

type SymbolDisplayPart = Readonly<{ text: string }>;

type SymbolWithJsDocTags = Readonly<{
    getJsDocTags: (checker?: unknown) => readonly JsDocTagInfo[];
    getName: () => string;
}>;

type TypeChecker = ReturnType<TypedProgram["getTypeChecker"]>;

type TypedProgram = NonNullable<
    ReturnType<typeof ESLintUtils.getParserServices>["program"]
>;

type TypeSymbol = Parameters<TypeChecker["getFullyQualifiedName"]>[0];

type TypeWithOptionalSymbol = Readonly<{
    symbol?: TypeSymbol;
}>;

const defaultOptions: Options = [{}];

const isImportOrExportSpecifier = (parent: Readonly<es.Node> | undefined): boolean =>
    parent?.type === "ExportSpecifier" ||
    parent?.type === "ImportDefaultSpecifier" ||
    parent?.type === "ImportNamespaceSpecifier" ||
    parent?.type === "ImportSpecifier";

const isDeclarationIdentifier = (node: Readonly<es.Identifier>): boolean => {
    const { parent } = node;
    if (parent === undefined) {
        return false;
    }

    if (parent.type === "TSInterfaceDeclaration" || parent.type === "TSTypeAliasDeclaration") {
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

const toTagComment = (
    text: readonly SymbolDisplayPart[] | string | undefined
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

const isTypeWithOptionalSymbol = (value: unknown): value is TypeWithOptionalSymbol =>
    typeof value === "object" && value !== null && "symbol" in value;

const isSymbolWithJsDocTags = (
    symbol: unknown
): symbol is SymbolWithJsDocTags => {
    if (typeof symbol !== "object" || symbol === null) {
        return false;
    }

    if (!("getJsDocTags" in symbol) || !("getName" in symbol)) {
        return false;
    }

    return (
        typeof symbol.getJsDocTags === "function" &&
        typeof symbol.getName === "function"
    );
};

const getDeprecatedTagComments = (
    symbol: unknown,
    checker: TypeChecker
): readonly (string | undefined)[] => {
    if (!isSymbolWithJsDocTags(symbol)) {
        return [];
    }

    return symbol
        .getJsDocTags(checker)
        .filter((tag) => tag.name === "deprecated")
        .map((tag) => toTagComment(tag.text));
};

/* eslint-disable security/detect-non-literal-regexp -- Rule options intentionally accept regex patterns. */
const toIgnorePatterns = (
    ignored: Readonly<Record<string, IgnoreMode>>
): IgnorePatterns => {
    const namePatterns: RegExp[] = [];
    const pathPatterns: RegExp[] = [];

    for (const [pattern, mode] of Object.entries(ignored)) {
        try {
            const regularExpression = new RegExp(pattern, "u");
            if (mode === "name") {
                namePatterns.push(regularExpression);
            } else {
                pathPatterns.push(regularExpression);
            }
        } catch {
            continue;
        }
    }

    return {
        name: namePatterns,
        path: pathPatterns,
    };
};
/* eslint-enable security/detect-non-literal-regexp -- Re-enable dynamic-regex checks outside option pattern compilation. */

const matchesAnyPattern = (
    text: string,
    patterns: readonly Readonly<RegExp>[]
): boolean => patterns.some((pattern) => pattern.test(text));

const getIdentifierSymbol = (
    typeChecker: TypeChecker,
    tsNode: Parameters<TypeChecker["getTypeAtLocation"]>[0]
): TypeSymbol | undefined => {
    const symbolFromLocation = typeChecker.getSymbolAtLocation(tsNode);
    if (symbolFromLocation !== undefined) {
        return symbolFromLocation;
    }

    const typeAtLocation = typeChecker.getTypeAtLocation(tsNode);
    if (
        isTypeWithOptionalSymbol(typeAtLocation) &&
        typeAtLocation.symbol !== undefined
    ) {
        return typeAtLocation.symbol;
    }

    return undefined;
};

/**
 * Disallow usages of symbols tagged with `@deprecated`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
        create: (context) => {
            const [{ ignored = {} } = {}] = context.options;
            const parserServices = ESLintUtils.getParserServices(context);
            const typeChecker = parserServices.program.getTypeChecker();
            const ignorePatterns = toIgnorePatterns(ignored);

            return {
                Identifier: (node: Readonly<es.Identifier>) => {
                    if (isImportOrExportSpecifier(node.parent)) {
                        return;
                    }

                    if (isDeclarationIdentifier(node)) {
                        return;
                    }

                    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                    const symbol = getIdentifierSymbol(typeChecker, tsNode);
                    if (symbol === undefined) {
                        return;
                    }

                    const symbolName = symbol.getName();
                    if (matchesAnyPattern(symbolName, ignorePatterns.name)) {
                        return;
                    }

                    const fullyQualifiedName = typeChecker.getFullyQualifiedName(symbol);
                    if (matchesAnyPattern(fullyQualifiedName, ignorePatterns.path)) {
                        return;
                    }

                    const deprecatedComments = getDeprecatedTagComments(
                        symbol,
                        typeChecker
                    );
                    if (deprecatedComments.length === 0) {
                        return;
                    }

                    for (const comment of deprecatedComments) {
                        if (comment === undefined) {
                            context.report({
                                data: { name: symbolName },
                                messageId: "forbidden",
                                node,
                            });
                            continue;
                        }

                        context.report({
                            data: {
                                comment,
                                name: symbolName,
                            },
                            messageId: "forbiddenWithComment",
                            node,
                        });
                    }
                },
            };
        },
        defaultOptions,
        meta: {
            defaultOptions: [{}],
            docs: {
                description: "disallow usage of APIs tagged with @deprecated.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-deprecated.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: '"{{name}}" is deprecated.',
                forbiddenWithComment: '"{{name}}" is deprecated: {{comment}}',
            },
            schema: [
                {
                    additionalProperties: false,
                    description: "Options for ignoring deprecated symbols by name or declaration path pattern.",
                    properties: {
                        ignored: {
                            additionalProperties: {
                                description: "Match behavior for the pattern key. Use \"name\" to match symbol names or \"path\" to match fully-qualified declaration paths.",
                                enum: ["name", "path"],
                                type: "string",
                            },
                            description: "Map of regex patterns to ignore mode.",
                            type: "object",
                        },
                    },
                    type: "object",
                },
            ],
            type: "problem",
        },
        name: "no-deprecated",
    });

export default rule;
