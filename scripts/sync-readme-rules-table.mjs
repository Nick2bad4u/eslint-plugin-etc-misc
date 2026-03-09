/**
 * @packageDocumentation
 * Synchronize or validate the README rules matrix from canonical rule metadata.
 */
// @ts-check

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * @typedef {Readonly<{
 *     plugin?: {
 *         name: string;
 *         url?: string;
 *     };
 *     rule?: {
 *         name: string;
 *         url?: string;
 *     };
 * }>} ReadmeReplacement
 */

/**
 * @typedef {Readonly<{
 *     message?: string;
 *     replacedBy?: readonly ReadmeReplacement[];
 * }>} ReadmeDeprecatedInfo
 */

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         namespace?: string;
 *         deprecated?: boolean | ReadmeDeprecatedInfo;
 *         docs?: {
 *             url?: string;
 *         };
 *         fixable?: string;
 *         hasSuggestions?: boolean;
 *     };
 * }>} ReadmeRuleModule
 */

/** @typedef {Readonly<Record<string, ReadmeRuleModule>>} ReadmeRulesMap */

/**
 * @typedef {Readonly<{
 *     meta?: {
 *         namespace?: string;
 *     };
 *     rules: ReadmeRulesMap;
 *     configs?: Readonly<
 *         Record<
 *             string,
 *             {
 *                 rules?: Readonly<Record<string, unknown>>;
 *             }
 *         >
 *     >;
 * }>} ReadmePlugin
 */

/** @typedef {keyof typeof presetIconByName} PresetName */

/** @typedef {Readonly<Record<PresetName, Set<string>>>} PresetRuleNamesByPreset */

/** @type {Readonly<Record<string, string>>} */
const presetIconByName = {
    recommended: "🟡",
    all: "🟣",
};

const presetOrder = ["recommended", "all"];

const rulesSectionHeading = "## Rules";

/**
 * @param {string} markdownText
 *
 * @returns {"\n" | "\r\n"}
 */
const detectLineEnding = (markdownText) =>
    markdownText.includes("\r\n") ? "\r\n" : "\n";

/**
 * @returns {PresetRuleNamesByPreset}
 */
const createEmptyPresetRuleNamesByPreset = () => ({
    all: new Set(),
    recommended: new Set(),
});

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

/**
 * @param {ReadmePlugin} plugin
 *
 * @returns {PresetRuleNamesByPreset}
 */
export const derivePresetRuleNamesByPresetFromPlugin = (plugin) => {
    const namespace = plugin.meta?.namespace ?? "etc-misc";
    const presetRuleNamesByPreset = createEmptyPresetRuleNamesByPreset();

    for (const presetName of presetOrder) {
        const configuredRules = plugin.configs?.[presetName]?.rules ?? {};
        const presetRuleNames = presetRuleNamesByPreset[presetName];

        for (const configuredRuleName of Object.keys(configuredRules)) {
            const normalizedRuleName = normalizeConfiguredRuleName(
                configuredRuleName,
                namespace
            );

            if (normalizedRuleName === null) {
                continue;
            }

            presetRuleNames.add(normalizedRuleName);
        }
    }

    return presetRuleNamesByPreset;
};

/**
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {"—" | "💡" | "🔧" | "🔧 💡"}
 */
const getRuleFixIndicator = (ruleModule) => {
    const fixable = ruleModule.meta?.fixable === "code";
    const hasSuggestions = ruleModule.meta?.hasSuggestions === true;

    if (fixable && hasSuggestions) {
        return "🔧 💡";
    }

    if (fixable) {
        return "🔧";
    }

    if (hasSuggestions) {
        return "💡";
    }

    return "—";
};

/**
 * @param {string} ruleName
 * @param {PresetRuleNamesByPreset} presetRuleNamesByPreset
 *
 * @returns {string}
 */
const getPresetIndicator = (ruleName, presetRuleNamesByPreset) => {
    /** @type {string[]} */
    const icons = [];

    for (const presetName of presetOrder) {
        if (presetRuleNamesByPreset[presetName].has(ruleName)) {
            icons.push(presetIconByName[presetName]);
        }
    }

    return icons.length === 0 ? "—" : icons.join(" ");
};

/**
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {readonly ReadmeReplacement[]}
 */
const getReplacementRules = (ruleModule) => {
    const deprecatedInfo = ruleModule.meta?.deprecated;

    if (deprecatedInfo === undefined || deprecatedInfo === false) {
        return [];
    }

    if (
        typeof deprecatedInfo === "object" &&
        Array.isArray(deprecatedInfo.replacedBy)
    ) {
        return deprecatedInfo.replacedBy;
    }

    return [];
};

/**
 * @param {ReadmeReplacement} replacement
 *
 * @returns {string}
 */
const formatReplacement = (replacement) => {
    const pluginName = replacement.plugin?.name;
    const ruleName = replacement.rule?.name;
    const normalizedPluginName =
        typeof pluginName === "string" && pluginName.length > 0
            ? pluginName
            : undefined;
    const normalizedRuleName =
        typeof ruleName === "string" && ruleName.length > 0
            ? ruleName
            : undefined;

    const displayName =
        typeof normalizedPluginName === "string" &&
        typeof normalizedRuleName === "string"
            ? normalizedPluginName === normalizedRuleName ||
              normalizedPluginName.endsWith(`/${normalizedRuleName}`)
                ? normalizedPluginName
                : normalizedRuleName.startsWith(`${normalizedPluginName}/`)
                  ? normalizedRuleName
                  : `${normalizedPluginName}/${normalizedRuleName}`
            : typeof normalizedRuleName === "string"
              ? normalizedRuleName
              : typeof normalizedPluginName === "string"
                ? normalizedPluginName
                : "replacement";
    const replacementUrl = replacement.rule?.url ?? replacement.plugin?.url;

    if (typeof replacementUrl === "string" && replacementUrl.length > 0) {
        return `[\`${displayName}\`](${replacementUrl})`;
    }

    return `\`${displayName}\``;
};

/**
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {string}
 */
const getDeprecatedIndicator = (ruleModule) =>
    ruleModule.meta?.deprecated === undefined ||
    ruleModule.meta?.deprecated === false
        ? "—"
        : "⚠️";

/**
 * @param {ReadmeRuleModule} ruleModule
 *
 * @returns {string}
 */
const getRecommendedReplacementIndicator = (ruleModule) => {
    const replacements = getReplacementRules(ruleModule);
    if (replacements.length === 0) {
        return "—";
    }

    return replacements
        .map((replacement) => formatReplacement(replacement))
        .join(" · ");
};

/**
 * @param {readonly [string, ReadmeRuleModule]} entry
 * @param {PresetRuleNamesByPreset} presetRuleNamesByPreset
 *
 * @returns {string}
 */
const toRuleTableRow = ([ruleName, ruleModule], presetRuleNamesByPreset) => {
    const docsUrl = ruleModule.meta?.docs?.url;

    if (typeof docsUrl !== "string" || docsUrl.trim().length === 0) {
        throw new TypeError(`Rule '${ruleName}' is missing meta.docs.url.`);
    }

    return `| [\`${ruleName}\`](${docsUrl}) | ${getRuleFixIndicator(ruleModule)} | ${getPresetIndicator(ruleName, presetRuleNamesByPreset)} | ${getDeprecatedIndicator(ruleModule)} | ${getRecommendedReplacementIndicator(ruleModule)} |`;
};

/**
 * Generate the canonical README rules section from plugin rules metadata.
 *
 * @param {ReadmeRulesMap} rules - Plugin `rules` map.
 * @param {PresetRuleNamesByPreset} presetRuleNamesByPreset - Rule-name lookup
 *   for each preset.
 *
 * @returns {string} Full markdown section text starting at `## Rules`.
 */
export const generateReadmeRulesSectionFromRules = (
    rules,
    presetRuleNamesByPreset,
    lineEnding = "\n"
) => {
    const ruleEntries = Object.entries(rules).toSorted((left, right) =>
        left[0].localeCompare(right[0])
    );

    const rows = ruleEntries.map((entry) =>
        toRuleTableRow(entry, presetRuleNamesByPreset)
    );

    return [
        "## Rules",
        "",
        "- `Fix` legend:",
        "  - `🔧` = autofixable",
        "  - `💡` = suggestions available",
        "  - `—` = report only",
        "- `Preset key` legend: `🟡 recommended` · `🟣 all`",
        "- `Deprecated` legend: `⚠️` = deprecated",
        "",
        "| Rule | Fix | Preset key | Deprecated | Recommended replacement |",
        "| --- | :-: | :-- | :-: | :-- |",
        ...rows,
        "",
        "",
    ].join(lineEnding);
};

/**
 * @param {string} workspaceRoot
 *
 * @returns {Promise<ReadmePlugin>}
 */
const loadBuiltPlugin = async (workspaceRoot) => {
    const builtPluginUrl = pathToFileURL(
        resolve(workspaceRoot, "dist/plugin.js")
    ).href;

    try {
        // eslint-disable-next-line no-unsanitized/method -- Controlled local file URL derived from workspace root and constant path.
        const importedModule = await import(builtPluginUrl);

        return /** @type {ReadmePlugin} */ (
            importedModule.default ?? importedModule
        );
    } catch (error) {
        throw new Error(
            "Unable to load dist/plugin.js. Run `npm run build` before syncing README rules table.",
            {
                cause: error,
            }
        );
    }
};

/**
 * @param {{ writeChanges: boolean }} input
 */
const syncReadmeRulesTable = async ({ writeChanges }) => {
    const workspaceRoot = resolve(fileURLToPath(import.meta.url), "../..");
    const readmePath = resolve(workspaceRoot, "README.md");
    const readmeText = await readFile(readmePath, "utf8");
    const lineEnding = detectLineEnding(readmeText);
    const builtPlugin = await loadBuiltPlugin(workspaceRoot);
    const presetRuleNamesByPreset =
        derivePresetRuleNamesByPresetFromPlugin(builtPlugin);

    const rulesHeadingOffset = readmeText.indexOf(rulesSectionHeading);

    if (rulesHeadingOffset < 0) {
        throw new Error("README.md is missing the '## Rules' section heading.");
    }

    const nextHeadingOffset = readmeText.indexOf(
        "\n## ",
        rulesHeadingOffset + rulesSectionHeading.length
    );

    const sectionEndOffset =
        nextHeadingOffset < 0 ? readmeText.length : nextHeadingOffset + 1;

    const readmePrefix = readmeText.slice(0, rulesHeadingOffset).trimEnd();
    const readmeSuffix = readmeText.slice(sectionEndOffset);

    const generatedRulesSection = generateReadmeRulesSectionFromRules(
        builtPlugin.rules,
        presetRuleNamesByPreset,
        lineEnding
    );

    const nextReadmeText = `${readmePrefix}${lineEnding}${lineEnding}${generatedRulesSection}${readmeSuffix}`;

    if (readmeText === nextReadmeText) {
        return {
            changed: false,
        };
    }

    if (!writeChanges) {
        return {
            changed: true,
        };
    }

    await writeFile(readmePath, nextReadmeText, "utf8");

    return {
        changed: true,
    };
};

const runCli = async () => {
    const writeChanges = process.argv.includes("--write");
    const result = await syncReadmeRulesTable({ writeChanges });

    if (!result.changed) {
        console.log("README rules table is already synchronized.");

        return;
    }

    if (writeChanges) {
        console.log("README rules table synchronized from plugin metadata.");

        return;
    }

    console.error(
        "README rules table is out of sync. Run: node scripts/sync-readme-rules-table.mjs --write"
    );
    process.exitCode = 1;
};

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    await runCli();
}
