/**
 * Global rule catalog indexed by rule name and documentation id.
 */
type RuleCatalog = Readonly<{
    readonly byDocId: Readonly<Record<string, RuleCatalogEntry>>;
    readonly byRuleName: Readonly<Record<string, RuleCatalogEntry>>;
    readonly ordered: readonly RuleCatalogEntry[];
}>;

/**
 * Single rule entry in the global catalog.
 */
type RuleCatalogEntry = Readonly<{
    readonly catalogId: string;
    readonly catalogIndex: number;
    readonly docId: string;
    readonly isTypeScriptRule: boolean;
    readonly ruleName: string;
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
    let ordered: readonly RuleCatalogEntry[] = [];
    let byRuleName: Readonly<Record<string, RuleCatalogEntry>> = {};
    let byDocId: Readonly<Record<string, RuleCatalogEntry>> = {};

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

        ordered = [...ordered, entry];
        byRuleName = { ...byRuleName, [ruleName]: entry };
        byDocId = { ...byDocId, [docId]: entry };
    }

    return {
        byDocId,
        byRuleName,
        ordered,
    };
};

export type { RuleCatalog, RuleCatalogEntry };
