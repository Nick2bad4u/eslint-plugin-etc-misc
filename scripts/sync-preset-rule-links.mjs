// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * @typedef {"all"
 *     | "allStrictWithDeprecated"
 *     | "allWithDeprecated"
 *     | "minimal"
 *     | "recommended"
 *     | "strict"
 *     | "strictTypeChecked"
 *     | "allStrict"} PresetName
 */

/**
 * @typedef {Readonly<{
 *     catalogId: string;
 *     catalogIndex: number;
 *     docId: string;
 *     isTypeScriptRule: boolean;
 *     ruleName: string;
 * }>} RuleCatalogEntry
 */

/**
 * @typedef {Readonly<{
 *     headingLevel: number;
 *     headingName: string;
 *     index: number;
 *     rawHeading: string;
 * }>} HeadingEntry
 */

/**
 * @typedef {object} BuiltPluginPresetConfig
 *
 * @property {Readonly<Record<string, unknown>>} [rules] - Rule entries for one
 *   preset.
 */

/**
 * @typedef {Readonly<Record<string, BuiltPluginPresetConfig>>} BuiltPluginConfigs
 */

/**
 * @typedef {Readonly<{
 *     namespace?: string;
 * }>} BuiltPluginMeta
 */

/**
 * @typedef {object} BuiltPlugin
 *
 * @property {BuiltPluginConfigs} [configs] - Preset config map from plugin
 *   build output.
 * @property {BuiltPluginMeta} [meta] - Plugin metadata used to resolve
 *   namespace-aware names.
 */

const thisFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(thisFilePath);
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");

const allStrictPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "all-strict.md"
);
const allStrictWithDeprecatedPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "all-strict-with-deprecated.md"
);
const allWithDeprecatedPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "all-with-deprecated.md"
);
const recommendedPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "recommended.md"
);
const minimalPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "minimal.md"
);
const strictPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "strict.md"
);
const strictTypeCheckedPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "strict-type-checked.md"
);
const allPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "all.md"
);
const ruleCatalogMapPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "rule-catalog-map.json"
);

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const toDocId = (ruleName) => ruleName.replaceAll("/", "-");

/**
 * @param {{
 *     catalogId: string;
 *     docId: string;
 *     ruleName: string;
 * }} input
 *
 * @returns {string}
 */
const toPresetRuleLinkLine = ({ catalogId, docId, ruleName }) =>
    `- [\`etc-misc/${ruleName}\`](../${docId}.md) (${catalogId})`;

/**
 * @param {string} content
 *
 * @returns {readonly HeadingEntry[]}
 */
const collectHeadings = (content) => {
    const headingMatches = content.matchAll(/^(#{1,6})\s+(.+?)\s*$/gmu);

    return [...headingMatches].map((match) => ({
        headingLevel: match[1]?.length ?? 0,
        headingName: match[2]?.trim() ?? "",
        index: match.index ?? 0,
        rawHeading: match[0] ?? "",
    }));
};

/**
 * @param {string} content
 * @param {string} sectionHeading
 * @param {string} replacementBody
 * @param {number} [headingLevel]
 *
 * @returns {string}
 *
 * @throws {Error} When the requested heading section cannot be found.
 */
const replaceSection = (
    content,
    sectionHeading,
    replacementBody,
    headingLevel = 2
) => {
    const headings = collectHeadings(content);
    const targetHeadingIndex = headings.findIndex(
        (heading) =>
            heading.headingLevel === headingLevel &&
            heading.headingName === sectionHeading
    );

    if (targetHeadingIndex === -1) {
        throw new Error(`Unable to find section: ${sectionHeading}`);
    }

    const targetHeading = headings[targetHeadingIndex];

    if (targetHeading === undefined) {
        throw new Error(
            `Unable to resolve heading index: ${targetHeadingIndex}`
        );
    }

    const nextHeading = headings
        .slice(targetHeadingIndex + 1)
        .find((heading) => heading.headingLevel <= headingLevel);

    const sectionStart = targetHeading.index;
    const sectionEnd = nextHeading?.index ?? content.length;
    const headingHashes = "#".repeat(headingLevel);
    const replacement = `${headingHashes} ${sectionHeading}\n\n${replacementBody}\n\n`;

    return `${content.slice(0, sectionStart)}${replacement}${content.slice(sectionEnd)}`;
};

/**
 * @returns {Promise<BuiltPlugin>}
 */
const loadBuiltPlugin = async () => {
    const builtPluginPath = path.join(repositoryRootPath, "dist", "plugin.js");
    const builtPluginUrl = pathToFileURL(builtPluginPath).href;

    try {
        // eslint-disable-next-line no-unsanitized/method -- Controlled local file URL derived from repository root and constant dist path.
        const importedModule = await import(builtPluginUrl);

        return /** @type {BuiltPlugin} */ (
            importedModule.default ?? importedModule
        );
    } catch (error) {
        throw new Error(
            "Unable to load dist/plugin.js. Run `npm run build` before syncing preset links.",
            {
                cause: error,
            }
        );
    }
};

/**
 * @param {string} configuredRuleName
 * @param {string} namespace
 *
 * @returns {null | string}
 */
const normalizeConfiguredRuleName = (configuredRuleName, namespace) => {
    const namespacePrefix = `${namespace}/`;

    if (configuredRuleName.startsWith(namespacePrefix)) {
        return configuredRuleName.slice(namespacePrefix.length);
    }

    if (configuredRuleName.includes("/")) {
        return null;
    }

    return configuredRuleName;
};

/** @type {readonly PresetName[]} */
const presetOrder = [
    "minimal",
    "recommended",
    "strict",
    "strictTypeChecked",
    "allStrict",
    "all",
    "allStrictWithDeprecated",
    "allWithDeprecated",
];

/** @type {readonly RuleCatalogEntry[]} */
const ruleCatalogMap = JSON.parse(await readFile(ruleCatalogMapPath, "utf8"));

const catalogByRuleName = new Map(
    ruleCatalogMap.map((entry) => [entry.ruleName, entry])
);

const plugin = await loadBuiltPlugin();
const namespace = plugin.meta?.namespace ?? "etc-misc";

/** @type {Record<PresetName, readonly string[]>} */
const presetRuleLinksByPresetName = {
    all: [],
    allStrict: [],
    allStrictWithDeprecated: [],
    allWithDeprecated: [],
    minimal: [],
    recommended: [],
    strict: [],
    strictTypeChecked: [],
};

for (const presetName of presetOrder) {
    const configuredRules = plugin.configs?.[presetName]?.rules ?? {};
    const ruleLinks = Object.keys(configuredRules)
        .flatMap((configuredRuleName) => {
            const normalizedRuleName = normalizeConfiguredRuleName(
                configuredRuleName,
                namespace
            );

            if (normalizedRuleName === null) {
                return [];
            }

            const entry = catalogByRuleName.get(normalizedRuleName);

            if (!entry) {
                throw new Error(
                    `Missing catalog entry for ${presetName} rule: ${normalizedRuleName}`
                );
            }

            return [
                toPresetRuleLinkLine({
                    catalogId: entry.catalogId,
                    docId: toDocId(normalizedRuleName),
                    ruleName: normalizedRuleName,
                }),
            ];
        })
        .toSorted((left, right) => left.localeCompare(right));

    presetRuleLinksByPresetName[presetName] = ruleLinks;
}

const allConfiguredRuleNames = new Set(
    Object.keys(plugin.configs?.["all"]?.rules ?? {}).flatMap(
        (configuredRuleName) => {
            const normalizedRuleName = normalizeConfiguredRuleName(
                configuredRuleName,
                namespace
            );

            return normalizedRuleName === null ? [] : [normalizedRuleName];
        }
    )
);

const allCoreRuleLinks = ruleCatalogMap
    .filter(
        (entry) =>
            allConfiguredRuleNames.has(entry.ruleName) &&
            !entry.ruleName.startsWith("typescript/")
    )
    .map((entry) => toPresetRuleLinkLine(entry));

const allTypeScriptRuleLinks = ruleCatalogMap
    .filter(
        (entry) =>
            allConfiguredRuleNames.has(entry.ruleName) &&
            entry.ruleName.startsWith("typescript/")
    )
    .map((entry) => toPresetRuleLinkLine(entry));

const allStrictPresetContent = await readFile(allStrictPresetDocPath, "utf8");
const allStrictWithDeprecatedPresetContent = await readFile(
    allStrictWithDeprecatedPresetDocPath,
    "utf8"
);
const allWithDeprecatedPresetContent = await readFile(
    allWithDeprecatedPresetDocPath,
    "utf8"
);
const minimalPresetContent = await readFile(minimalPresetDocPath, "utf8");
const recommendedPresetContent = await readFile(
    recommendedPresetDocPath,
    "utf8"
);
const strictPresetContent = await readFile(strictPresetDocPath, "utf8");
const strictTypeCheckedPresetContent = await readFile(
    strictTypeCheckedPresetDocPath,
    "utf8"
);
const allPresetContent = await readFile(allPresetDocPath, "utf8");

const updatedAllStrictPresetContent = replaceSection(
    allStrictPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["allStrict"].join("\n")
);
const updatedAllStrictWithDeprecatedPresetContent = replaceSection(
    allStrictWithDeprecatedPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["allStrictWithDeprecated"].join("\n")
);
const updatedAllWithDeprecatedPresetContent = replaceSection(
    allWithDeprecatedPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["allWithDeprecated"].join("\n")
);

const updatedMinimalPresetContent = replaceSection(
    minimalPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["minimal"].join("\n")
);

const updatedRecommendedPresetContent = replaceSection(
    recommendedPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["recommended"].join("\n")
);

const updatedStrictPresetContent = replaceSection(
    strictPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["strict"].join("\n")
);

const updatedStrictTypeCheckedPresetContent = replaceSection(
    strictTypeCheckedPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName["strictTypeChecked"].join("\n")
);

const updatedAllPresetContentWithCore = replaceSection(
    allPresetContent,
    "Core rules",
    allCoreRuleLinks.join("\n"),
    3
);

const updatedAllPresetContent = replaceSection(
    updatedAllPresetContentWithCore,
    "TypeScript-scoped rules",
    allTypeScriptRuleLinks.join("\n"),
    3
);

await writeFile(allStrictPresetDocPath, updatedAllStrictPresetContent, "utf8");
await writeFile(
    allStrictWithDeprecatedPresetDocPath,
    updatedAllStrictWithDeprecatedPresetContent,
    "utf8"
);
await writeFile(
    allWithDeprecatedPresetDocPath,
    updatedAllWithDeprecatedPresetContent,
    "utf8"
);
await writeFile(minimalPresetDocPath, updatedMinimalPresetContent, "utf8");
await writeFile(
    recommendedPresetDocPath,
    updatedRecommendedPresetContent,
    "utf8"
);
await writeFile(strictPresetDocPath, updatedStrictPresetContent, "utf8");
await writeFile(
    strictTypeCheckedPresetDocPath,
    updatedStrictTypeCheckedPresetContent,
    "utf8"
);
await writeFile(allPresetDocPath, updatedAllPresetContent, "utf8");
