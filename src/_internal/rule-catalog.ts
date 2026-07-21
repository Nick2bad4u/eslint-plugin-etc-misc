import type { UnknownRecord } from "type-fest";

import { isSafeInteger, keyIn, objectEntries, setHas } from "ts-extras";

// eslint-disable-next-line import-x/extensions -- Node.js requires the JSON extension at runtime.
import rawRuleCatalogAssignments from "./rule-catalog-assignments.json" with { type: "json" };

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
type RuleCatalogAssignment = Readonly<{
    readonly catalogIndex: number;
    readonly status: "active" | "retired";
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

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const parseRuleCatalogAssignments = (
    value: unknown
): Readonly<Record<string, RuleCatalogAssignment>> => {
    if (!isUnknownRecord(value)) {
        throw new TypeError("Rule catalog assignments must be an object.");
    }

    let assignments: Readonly<Record<string, RuleCatalogAssignment>> = {};

    for (const [ruleName, rawAssignment] of objectEntries(value)) {
        if (!isUnknownRecord(rawAssignment)) {
            throw new TypeError(
                `Rule catalog assignment for "${ruleName}" must be an object.`
            );
        }

        const catalogIndex = rawAssignment["catalogIndex"];
        const status = rawAssignment["status"];

        if (
            typeof catalogIndex !== "number" ||
            !isSafeInteger(catalogIndex) ||
            catalogIndex < 1
        ) {
            throw new TypeError(
                `Rule catalog index for "${ruleName}" must be a positive safe integer.`
            );
        }

        if (status !== "active" && status !== "retired") {
            throw new TypeError(
                `Rule catalog status for "${ruleName}" must be active or retired.`
            );
        }

        assignments = {
            ...assignments,
            [ruleName]: { catalogIndex, status },
        };
    }

    return assignments;
};

const ruleCatalogAssignments = parseRuleCatalogAssignments(
    rawRuleCatalogAssignments
);

const hasRuleCatalogAssignment = (ruleName: string): boolean =>
    keyIn(ruleCatalogAssignments, ruleName);

const includesSetValue = <Value>(
    values: ReadonlySet<Value>,
    value: Value
): boolean => setHas(values, value);

const toCatalogNumericPart = (catalogIndex: number): string =>
    `${catalogIndex}`.padStart(3, "0");

/**
 * Format a catalog index as an ID like `R001`.
 */
const toRuleCatalogId = (catalogIndex: number): string =>
    `R${toCatalogNumericPart(catalogIndex)}`;

/**
 * Convert a rule name to its documentation page id.
 */
const toRuleDocId = (ruleName: string): string => ruleName.replaceAll("/", "-");

/**
 * Build a globally ordered rule catalog from persistent, never-reused ids.
 */
export const buildRuleCatalog = (ruleNames: readonly string[]): RuleCatalog => {
    const registeredRuleNames = new Set(ruleNames);
    const seenCatalogIndexes = new Set<number>();
    let activeEntries: readonly RuleCatalogEntry[] = [];
    let byRuleName: Readonly<Record<string, RuleCatalogEntry>> = {};
    let byDocId: Readonly<Record<string, RuleCatalogEntry>> = {};

    for (const [ruleName, assignment] of objectEntries(
        ruleCatalogAssignments
    )) {
        const { catalogIndex, status } = assignment;

        if (includesSetValue(seenCatalogIndexes, catalogIndex)) {
            throw new Error(`Duplicate rule catalog index R${catalogIndex}.`);
        }

        seenCatalogIndexes.add(catalogIndex);

        if (status === "retired") {
            if (includesSetValue(registeredRuleNames, ruleName)) {
                throw new Error(
                    `Retired rule catalog entry "${ruleName}" is still registered.`
                );
            }

            continue;
        }

        if (!includesSetValue(registeredRuleNames, ruleName)) {
            throw new Error(
                `Active rule catalog entry "${ruleName}" is not registered.`
            );
        }

        const docId = toRuleDocId(ruleName);
        const entry: RuleCatalogEntry = {
            catalogId: toRuleCatalogId(catalogIndex),
            catalogIndex,
            docId,
            isTypeScriptRule: ruleName.startsWith("typescript/"),
            ruleName,
        };

        activeEntries = [...activeEntries, entry];
        byRuleName = { ...byRuleName, [ruleName]: entry };
        byDocId = { ...byDocId, [docId]: entry };
    }

    for (const ruleName of registeredRuleNames) {
        if (!hasRuleCatalogAssignment(ruleName)) {
            throw new Error(
                `Registered rule "${ruleName}" has no persistent catalog assignment.`
            );
        }
    }

    const ordered = activeEntries.toSorted(
        (leftEntry, rightEntry) =>
            leftEntry.catalogIndex - rightEntry.catalogIndex
    );

    return {
        byDocId,
        byRuleName,
        ordered,
    };
};

export type { RuleCatalog, RuleCatalogEntry };
