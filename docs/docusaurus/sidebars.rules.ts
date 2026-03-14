/**
 * @packageDocumentation
 * Dynamic sidebar generation for plugin rule documentation sections.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/** Minimal document item shape used by generated rule categories. */
type SidebarDocItem = {
    readonly id: string;
    readonly label?: string;
    readonly type: "doc";
};

type RuleCatalogMapEntry = Readonly<{
    catalogId: string;
    docId: string;
    ruleName: string;
}>;

/** Directory containing this sidebar module. */
const sidebarDirectoryPath = dirname(fileURLToPath(import.meta.url));
/** Directory containing generated rule docs consumed by the sidebar. */
const rulesDocsDirectoryPath = join(sidebarDirectoryPath, "..", "rules");
const ruleCatalogMapFilePath = join(
    rulesDocsDirectoryPath,
    "rule-catalog-map.json"
);
/** Directory containing plugin rule source files. */
const sourceRulesDirectoryPath = join(
    sidebarDirectoryPath,
    "..",
    "..",
    "src",
    "rules"
);

/** Docs that are part of the rules docs plugin but are not individual rule docs. */
const nonRuleDocIds = new Set(["overview", "getting-started"]);

const ruleCatalogMap = JSON.parse(
    readFileSync(ruleCatalogMapFilePath, "utf8")
) as readonly RuleCatalogMapEntry[];

const ruleCatalogByDocId = new Map(
    ruleCatalogMap.map((entry) => [entry.docId, entry])
);

/** Check whether a directory entry name is a markdown file. */
const isMarkdownFile = (fileName: string): boolean => fileName.endsWith(".md");
/** Check whether a directory entry name is a TypeScript source file. */
const isTypeScriptRuleFile = (fileName: string): boolean =>
    fileName.endsWith(".ts");

/** Convert a markdown filename (e.g. `foo.md`) to a Docusaurus doc id. */
const toRuleDocId = (fileName: string): string => fileName.slice(0, -3);
/** Convert a TypeScript filename (e.g. `foo.ts`) to a rule id. */
const toRuleId = (fileName: string): string => fileName.slice(0, -3);

/** Convert a markdown path (e.g. `foo/bar.md`) to a Docusaurus doc id. */
const toDocIdFromRelativePath = (relativePath: string): string =>
    relativePath.replace(/\\/gu, "/").replace(/\.md$/u, "");

/** Collect markdown doc ids recursively from a docs directory. */
const collectMarkdownDocIdsRecursively = (
    directoryPath: string,
    relativeBasePath = ""
): readonly string[] => {
    const discoveredDocIds: string[] = [];

    const directoryEntries = readdirSync(directoryPath, {
        withFileTypes: true,
    });

    for (const directoryEntry of directoryEntries) {
        const entryRelativePath =
            relativeBasePath.length > 0
                ? `${relativeBasePath}/${directoryEntry.name}`
                : directoryEntry.name;
        const entryAbsolutePath = join(directoryPath, directoryEntry.name);

        if (directoryEntry.isDirectory()) {
            discoveredDocIds.push(
                ...collectMarkdownDocIdsRecursively(
                    entryAbsolutePath,
                    entryRelativePath
                )
            );
            continue;
        }

        if (directoryEntry.isFile() && isMarkdownFile(directoryEntry.name)) {
            discoveredDocIds.push(toDocIdFromRelativePath(entryRelativePath));
        }
    }

    return discoveredDocIds;
};

const isTypeScriptRuleDocId = (ruleDocId: string): boolean =>
    ruleDocId.startsWith("typescript-");

/** Sorted markdown doc ids discovered from `docs/rules/*.md`. */
const allRulesMarkdownDocIds = readdirSync(rulesDocsDirectoryPath, {
    withFileTypes: true,
})
    .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
    .map((entry) => toRuleDocId(entry.name))
    .sort((left, right) => left.localeCompare(right));

/** Sorted markdown doc ids discovered from `docs/rules/**`. */
const allRulesPluginDocIds = collectMarkdownDocIdsRecursively(
    rulesDocsDirectoryPath
)
    .slice()
    .sort((left, right) => left.localeCompare(right));
const allRulesPluginDocIdSet = new Set(allRulesPluginDocIds);

const hasRulesPluginDocId = (docId: string): boolean =>
    allRulesPluginDocIdSet.has(docId);

/** Sorted rule ids discovered from `src/rules/*.ts`. */
const sourceRuleIds = readdirSync(sourceRulesDirectoryPath, {
    withFileTypes: true,
})
    .filter((entry) => entry.isFile() && isTypeScriptRuleFile(entry.name))
    .map((entry) => toRuleId(entry.name))
    .sort((left, right) => left.localeCompare(right));

/** Rule-doc ids that correspond to actual rule documentation pages. */
const documentedRuleDocIds = allRulesMarkdownDocIds.filter(
    (ruleDocId) => !nonRuleDocIds.has(ruleDocId)
);

const documentedRuleDocIdSet = new Set(documentedRuleDocIds);
const sourceRuleIdSet = new Set(sourceRuleIds);

/** Source rules that are missing docs pages. */
const missingRuleDocIds = sourceRuleIds.filter(
    (ruleId) => !documentedRuleDocIdSet.has(ruleId)
);
/** Rule docs that no longer map to a source rule. */
const staleRuleDocIds = documentedRuleDocIds.filter(
    (ruleDocId) => !sourceRuleIdSet.has(ruleDocId)
);

if (missingRuleDocIds.length > 0 || staleRuleDocIds.length > 0) {
    throw new Error(
        [
            "Rule documentation coverage mismatch detected.",
            ...(missingRuleDocIds.length > 0
                ? [`Missing docs for rules: ${missingRuleDocIds.join(", ")}`]
                : []),
            ...(staleRuleDocIds.length > 0
                ? [
                      `Docs without matching source rule: ${staleRuleDocIds.join(", ")}`,
                  ]
                : []),
        ].join("\n")
    );
}

/** Build sidebar doc items for a list of doc ids. */
const createRuleItems = (ruleDocIds: readonly string[]): SidebarDocItem[] =>
    ruleDocIds.map((ruleDocId) => ({
        id: ruleDocId,
        label: (() => {
            const entry = ruleCatalogByDocId.get(ruleDocId);

            if (!entry) {
                return ruleDocId;
            }

            return `${entry.catalogId} · ${entry.ruleName}`;
        })(),
        type: "doc",
    }));

const preRuleDocs: SidebarsConfig["rules"] = [];

if (hasRulesPluginDocId("overview")) {
    preRuleDocs.push({
        className: "sb-doc-overview",
        id: "overview",
        label: "🏁 Overview",
        type: "doc",
    });
}

if (hasRulesPluginDocId("getting-started")) {
    preRuleDocs.push({
        className: "sb-doc-getting-started",
        id: "getting-started",
        label: "🚀 Getting Started",
        type: "doc",
    });
}

const guideItems: SidebarsConfig["rules"] = [];

if (hasRulesPluginDocId("guides/adoption-checklist")) {
    guideItems.push({
        id: "guides/adoption-checklist",
        label: "✅ Adoption checklist",
        type: "doc",
    });
}

if (hasRulesPluginDocId("guides/rollout-and-fix-safety")) {
    guideItems.push({
        id: "guides/rollout-and-fix-safety",
        label: "🛡️ Rollout and fix safety",
        type: "doc",
    });
}

if (guideItems.length > 0) {
    preRuleDocs.push({
        className: "sb-cat-guides",
        collapsed: true,
        customProps: {
            badge: "guides",
        },
        type: "category",
        label: "🧭 Adoption & Rollout",
        link: {
            type: "generated-index",
            title: "Adoption & Rollout",
            description:
                "Shared migration, rollout, and fix-safety guidance for rule adoption.",
        },
        items: guideItems,
    });
}

const presetItems: SidebarsConfig["rules"] = [];

if (hasRulesPluginDocId("presets/recommended")) {
    presetItems.push({
        id: "presets/recommended",
        label: "🟡 Recommended",
        type: "doc",
    });
}

if (hasRulesPluginDocId("presets/strict")) {
    presetItems.push({
        id: "presets/strict",
        label: "🟠 Strict",
        type: "doc",
    });
}

if (hasRulesPluginDocId("presets/strict-type-checked")) {
    presetItems.push({
        id: "presets/strict-type-checked",
        label: "🔵 Strict Type-Checked",
        type: "doc",
    });
}

if (hasRulesPluginDocId("presets/all-strict")) {
    presetItems.push({
        id: "presets/all-strict",
        label: "🔴 All Strict",
        type: "doc",
    });
}

if (hasRulesPluginDocId("presets/all")) {
    presetItems.push({
        id: "presets/all",
        label: "🟣 All",
        type: "doc",
    });
}

if (presetItems.length > 0) {
    preRuleDocs.push({
        className: "sb-cat-presets",
        collapsed: true,
        customProps: {
            badge: "presets",
        },
        type: "category",
        label: "🎛 Presets",
        link: {
            type: "generated-index",
            title: "Presets",
            description:
                "Predefined flat-config preset bundles for different adoption levels.",
        },
        items: presetItems,
    });
}

/** Rule-doc ids for all remaining core etc-misc rules. */
const coreRuleDocIds = documentedRuleDocIds.filter(
    (ruleDocId) => !isTypeScriptRuleDocId(ruleDocId)
);
/** Rule-doc ids for TypeScript-scoped rules. */
const typeScriptRuleDocIds = documentedRuleDocIds.filter(isTypeScriptRuleDocId);

const categorizedRuleDocIdSet = new Set<string>([
    ...coreRuleDocIds,
    ...typeScriptRuleDocIds,
]);

const uncategorizedRuleDocIds = documentedRuleDocIds.filter(
    (ruleDocId) => !categorizedRuleDocIdSet.has(ruleDocId)
);

if (uncategorizedRuleDocIds.length > 0) {
    throw new Error(
        `Rule docs were discovered but not categorized in sidebars.rules.ts: ${uncategorizedRuleDocIds.join(", ")}`
    );
}

/** Complete sidebar structure for docs site navigation. */
const sidebars: SidebarsConfig = {
    rules: [
        ...preRuleDocs,
        {
            className: "sb-cat-rules",
            collapsed: true,
            customProps: {
                badge: "rules",
            },
            type: "category",
            label: "📏 Rules",
            link: {
                type: "generated-index",
                title: "Rule Reference",
                slug: "/",
                description:
                    "Rule documentation for every eslint-plugin-etc-misc rule.",
            },
            items: [
                {
                    className: "sb-cat-rules-core",
                    collapsed: true,
                    customProps: {
                        badge: "core",
                    },
                    type: "category",
                    label: "🧱 Core Rules",
                    link: {
                        type: "generated-index",
                        title: "Core Rules",
                        description:
                            "General-purpose etc-misc rules for safer and clearer TypeScript code.",
                    },
                    items: createRuleItems(coreRuleDocIds),
                },
                {
                    className: "sb-cat-rules-typescript",
                    collapsed: true,
                    customProps: {
                        badge: "typescript",
                    },
                    type: "category",
                    label: "🧠 TypeScript Rules",
                    link: {
                        type: "generated-index",
                        title: "TypeScript Rules",
                        description:
                            "Rules focused on stronger TypeScript-only constraints and type-level consistency.",
                    },
                    items: createRuleItems(typeScriptRuleDocIds),
                },
            ],
        },
    ],
};

export default sidebars;
