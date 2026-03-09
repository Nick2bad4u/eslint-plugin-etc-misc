import type { TSESTree as es } from "@typescript-eslint/utils";

import { minimatch } from "minimatch";

/**
 * Allow/disallow glob options for import source checks.
 */
type ImportPathOptions = Readonly<{
    allow?: readonly string[];
    disallow?: readonly string[];
}>;

const matchesAnyPattern = (
    value: string,
    patterns: readonly string[]
): boolean =>
    patterns.some((pattern) =>
        minimatch(value, pattern, {
            dot: true,
            nocase: false,
        })
    );

const getImportSourceText = (node: Readonly<es.Node>): string | undefined => {
    if (
        node.type === "ExportAllDeclaration" ||
        node.type === "ImportDeclaration"
    ) {
        return node.source.value;
    }

    if (node.type === "ExportNamedDeclaration") {
        return node.source?.value;
    }

    if (node.type === "ImportExpression") {
        return node.source.type === "Literal" &&
            typeof node.source.value === "string"
            ? node.source.value
            : undefined;
    }

    return undefined;
};

const toMergedOptions = (
    options: Readonly<ImportPathOptions> | undefined,
    defaultDisallowPatterns: readonly string[]
): Required<ImportPathOptions> => ({
    allow: options?.allow ?? [],
    disallow: options?.disallow ?? defaultDisallowPatterns,
});

/**
 * Determines whether an import source should be reported.
 *
 * @param sourceText - Source text from an import/export node.
 * @param options - Rule options for allow/disallow overrides.
 * @param defaultDisallowPatterns - Rule-specific default disallow patterns.
 *
 * @returns `true` when the source matches a disallow pattern and no allow
 *   pattern.
 */
export const shouldReportImportSource = (
    sourceText: string,
    options: Readonly<ImportPathOptions> | undefined,
    defaultDisallowPatterns: readonly string[]
): boolean => {
    const mergedOptions = toMergedOptions(options, defaultDisallowPatterns);
    if (!matchesAnyPattern(sourceText, mergedOptions.disallow)) {
        return false;
    }

    return !matchesAnyPattern(sourceText, mergedOptions.allow);
};

/**
 * Gets import source text from supported import/export AST nodes.
 *
 * @param node - AST node to inspect.
 *
 * @returns Source text when present and string-literal based, otherwise
 *   `undefined`.
 */
export const getImportSourceFromNode = (
    node: Readonly<es.Node>
): string | undefined => getImportSourceText(node);

export type { ImportPathOptions };
