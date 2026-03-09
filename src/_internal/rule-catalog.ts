/**
 * Global rule catalog indexed by rule name and documentation id.
 */
type RuleCatalog = Readonly<{
    byDocId: Readonly<Record<string, RuleCatalogEntry>>;
    byRuleName: Readonly<Record<string, RuleCatalogEntry>>;
    ordered: readonly RuleCatalogEntry[];
}>;

/**
 * Single rule entry in the global catalog.
 */
type RuleCatalogEntry = Readonly<{
    catalogId: string;
    catalogIndex: number;
    docId: string;
    isTypeScriptRule: boolean;
    ruleName: string;
}>;

const toCatalogNumericPart = (catalogIndex: number): string =>
    `${catalogIndex}`.padStart(3, "0");

/**
 * Format a catalog index as an ID like `R001`.
 */
export const toRuleCatalogId = (catalogIndex: number): string =>
    `R${toCatalogNumericPart(catalogIndex)}`;

/**
 * Convert a rule name to its documentation page id.
 */
export const toRuleDocId = (ruleName: string): string =>
    ruleName.replaceAll("/", "-");

/**
 * Sort rules so core rules come first, then TypeScript-scoped rules.
 */
export const compareRuleNamesForCatalog = (
    leftRuleName: string,
    rightRuleName: string
): number => {
    const leftIsTypeScriptRule = leftRuleName.startsWith("typescript/");
    const rightIsTypeScriptRule = rightRuleName.startsWith("typescript/");

    if (leftIsTypeScriptRule !== rightIsTypeScriptRule) {
        return leftIsTypeScriptRule ? 1 : -1;
    }

    return leftRuleName.localeCompare(rightRuleName);
};

/**
 * Build a globally ordered rule catalog map keyed by both rule name and doc id.
 */
export const buildRuleCatalog = (ruleNames: readonly string[]): RuleCatalog => {
    const sortedRuleNames = ruleNames.toSorted(compareRuleNamesForCatalog);
    const ordered: RuleCatalogEntry[] = [];
    const byRuleName: Record<string, RuleCatalogEntry> = {};
    const byDocId: Record<string, RuleCatalogEntry> = {};

    for (const [zeroBasedIndex, ruleName] of sortedRuleNames.entries()) {
        const catalogIndex = zeroBasedIndex + 1;
        const docId = toRuleDocId(ruleName);
        const entry: RuleCatalogEntry = {
            catalogId: toRuleCatalogId(catalogIndex),
            catalogIndex,
            docId,
            isTypeScriptRule: ruleName.startsWith("typescript/"),
            ruleName,
        };

        ordered.push(entry);
        byRuleName[ruleName] = entry;
        byDocId[docId] = entry;
    }

    return {
        byDocId,
        byRuleName,
        ordered,
    };
};

export type { RuleCatalog, RuleCatalogEntry };
