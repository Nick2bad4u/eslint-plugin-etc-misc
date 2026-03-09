import type { TSESTree as es } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

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
}>;

const defaultOptions: Options = [{}];

const isImportOrExportSpecifier = (
    parent: Readonly<es.Node> | undefined
): boolean =>
    parent?.type === "ExportSpecifier" ||
    parent?.type === "ImportDefaultSpecifier" ||
    parent?.type === "ImportNamespaceSpecifier" ||
    parent?.type === "ImportSpecifier";

const isDeclarationIdentifier = (node: Readonly<es.Identifier>): boolean => {
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

const toTagComment = (
    text: readonly SymbolDisplayPart[] | string | undefined
): string | undefined => {
    if (text === undefined) {
        return undefined;
    }

    if (typeof text === "string") {
        const normalized = text.trim();
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

const getInternalTagComments = (
    symbol: unknown,
    checker: unknown
): readonly (string | undefined)[] => {
    if (!isSymbolWithJsDocTags(symbol)) {
        return [];
    }

    return symbol
        .getJsDocTags(checker)
        .filter((tag) => tag.name === "internal")
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

/**
 * Disallow usages of symbols tagged with `@internal`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
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
                const symbol = typeChecker.getSymbolAtLocation(tsNode);
                if (symbol === undefined) {
                    return;
                }

                const symbolName = symbol.getName();
                if (matchesAnyPattern(symbolName, ignorePatterns.name)) {
                    return;
                }

                const fullyQualifiedName =
                    typeChecker.getFullyQualifiedName(symbol);
                if (
                    matchesAnyPattern(fullyQualifiedName, ignorePatterns.path)
                ) {
                    return;
                }

                const internalComments = getInternalTagComments(
                    symbol,
                    typeChecker
                );
                if (internalComments.length === 0) {
                    return;
                }

                for (const comment of internalComments) {
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
            description: "disallow usage of APIs tagged with @internal.",
            recommended: false,
            requiresTypeChecking: true,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-internal.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden: '"{{name}}" is internal.',
            forbiddenWithComment: '"{{name}}" is internal: {{comment}}',
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Options for ignoring some internal symbols by name or declaration path pattern.",
                properties: {
                    ignored: {
                        additionalProperties: {
                            description:
                                'Match behavior for the pattern key. Use "name" to match symbol names or "path" to match fully-qualified declaration paths.',
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
    name: "no-internal",
});

export default rule;
