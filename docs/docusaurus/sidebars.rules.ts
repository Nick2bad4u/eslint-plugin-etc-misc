/**
 * @packageDocumentation
 * Dynamic sidebar generation for plugin rule documentation sections.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/** Minimal document item shape used by generated rule categories. */
type SidebarDocItem = {
    readonly id: string;
    readonly type: "doc";
};

/** Directory containing this sidebar module. */
const sidebarDirectoryPath = dirname(fileURLToPath(import.meta.url));
/** Directory containing generated rule docs consumed by the sidebar. */
const rulesDocsDirectoryPath = join(sidebarDirectoryPath, "..", "rules");
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

/** Check whether a directory entry name is a markdown file. */
const isMarkdownFile = (fileName: string): boolean => fileName.endsWith(".md");
/** Check whether a directory entry name is a TypeScript source file. */
const isTypeScriptRuleFile = (fileName: string): boolean =>
    fileName.endsWith(".ts");

/** Convert a markdown filename (e.g. `foo.md`) to a Docusaurus doc id. */
const toRuleDocId = (fileName: string): string => fileName.slice(0, -3);
/** Convert a TypeScript filename (e.g. `foo.ts`) to a rule id. */
const toRuleId = (fileName: string): string => fileName.slice(0, -3);

const isTsExtrasRuleDocId = (ruleDocId: string): boolean =>
    ruleDocId.startsWith("prefer-ts-extras-");

const isTypeFestRuleDocId = (ruleDocId: string): boolean =>
    ruleDocId.startsWith("prefer-type-fest-");

/** Sorted markdown doc ids discovered from `docs/rules/*.md`. */
const allRulesMarkdownDocIds = readdirSync(rulesDocsDirectoryPath, {
    withFileTypes: true,
})
    .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
    .map((entry) => toRuleDocId(entry.name))
    .sort((left, right) => left.localeCompare(right));

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
        type: "doc",
    }));

/** Rule-doc ids for `prefer-ts-extras-*` rules. */
const tsExtrasRuleDocIds = documentedRuleDocIds.filter(isTsExtrasRuleDocId);
/** Rule-doc ids for `prefer-type-fest-*` rules. */
const typeFestRuleDocIds = documentedRuleDocIds.filter(isTypeFestRuleDocId);
/** Rule-doc ids for all remaining core etc-misc rules. */
const coreRuleDocIds = documentedRuleDocIds.filter(
    (ruleDocId) =>
        !isTsExtrasRuleDocId(ruleDocId) && !isTypeFestRuleDocId(ruleDocId)
);

const categorizedRuleDocIdSet = new Set<string>([
    ...coreRuleDocIds,
    ...tsExtrasRuleDocIds,
    ...typeFestRuleDocIds,
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
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-doc-getting-started",
            id: "getting-started",
            label: "🚀 Getting Started",
            type: "doc",
        },
        {
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
            items: [
                {
                    id: "guides/adoption-checklist",
                    label: "✅ Adoption checklist",
                    type: "doc",
                },
                {
                    id: "guides/rollout-and-fix-safety",
                    label: "🛡️ Rollout and fix safety",
                    type: "doc",
                },
            ],
        },
        {
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
            items: [
                {
                    id: "presets/recommended",
                    label: "🟡 Recommended",
                    type: "doc",
                },
                {
                    id: "presets/all",
                    label: "🟣 All",
                    type: "doc",
                },
            ],
        },
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
                    className: "sb-cat-rules-ts-extras",
                    collapsed: true,
                    customProps: {
                        badge: "ts-extras",
                    },
                    type: "category",
                    label: "🧰 ts-extras Rules",
                    link: {
                        type: "generated-index",
                        title: "ts-extras Rules",
                        description:
                            "Rules that prefer ts-extras runtime helpers and utility functions.",
                    },
                    items: createRuleItems(tsExtrasRuleDocIds),
                },
                {
                    className: "sb-cat-rules-type-fest",
                    collapsed: true,
                    customProps: {
                        badge: "type-fest",
                    },
                    type: "category",
                    label: "✨ type-fest Rules",
                    link: {
                        type: "generated-index",
                        title: "type-fest Rules",
                        description:
                            "Rules that prefer expressive type-fest utility types for clearer type-level code.",
                    },
                    items: createRuleItems(typeFestRuleDocIds),
                },
            ],
        },
    ],
};

export default sidebars;
