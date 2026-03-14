import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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
const recommendedPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "recommended.md"
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

const toDocId = (ruleName) => ruleName.replaceAll("/", "-");

const toPresetRuleLinkLine = ({ catalogId, docId, ruleName }) =>
    `- [\`etc-misc/${ruleName}\`](../${docId}.md) (${catalogId})`;

const collectHeadings = (content) => {
    const headingMatches = content.matchAll(/^(#{1,6})\s+(.+?)\s*$/gmu);

    return [...headingMatches].map((match) => ({
        headingLevel: match[1]?.length ?? 0,
        headingName: match[2]?.trim() ?? "",
        index: match.index ?? 0,
        rawHeading: match[0] ?? "",
    }));
};

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
    const nextHeading = headings
        .slice(targetHeadingIndex + 1)
        .find((heading) => heading.headingLevel <= headingLevel);

    const sectionStart = targetHeading.index;
    const sectionEnd = nextHeading?.index ?? content.length;
    const headingHashes = "#".repeat(headingLevel);
    const replacement = `${headingHashes} ${sectionHeading}\n\n${replacementBody}\n\n`;

    return `${content.slice(0, sectionStart)}${replacement}${content.slice(sectionEnd)}`;
};

const loadBuiltPlugin = async () => {
    const builtPluginPath = path.join(repositoryRootPath, "dist", "plugin.js");
    const builtPluginUrl = pathToFileURL(builtPluginPath).href;

    try {
        // eslint-disable-next-line no-unsanitized/method -- Controlled local file URL derived from repository root and constant dist path.
        const importedModule = await import(builtPluginUrl);

        return importedModule.default ?? importedModule;
    } catch (error) {
        throw new Error(
            "Unable to load dist/plugin.js. Run `npm run build` before syncing preset links.",
            {
                cause: error,
            }
        );
    }
};

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

const presetOrder = [
    "recommended",
    "strict",
    "strictTypeChecked",
    "allStrict",
];

const ruleCatalogMap = JSON.parse(await readFile(ruleCatalogMapPath, "utf8"));

const catalogByRuleName = new Map(
    ruleCatalogMap.map((entry) => [entry.ruleName, entry])
);

const plugin = await loadBuiltPlugin();
const namespace = plugin.meta?.namespace ?? "etc-misc";

const presetRuleLinksByPresetName = Object.fromEntries(
    presetOrder.map((presetName) => {
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

        return [presetName, ruleLinks];
    })
);

const allCoreRuleLinks = ruleCatalogMap
    .filter((entry) => !entry.ruleName.startsWith("typescript/"))
    .map((entry) => toPresetRuleLinkLine(entry));

const allTypeScriptRuleLinks = ruleCatalogMap
    .filter((entry) => entry.ruleName.startsWith("typescript/"))
    .map((entry) => toPresetRuleLinkLine(entry));

const allStrictPresetContent = await readFile(allStrictPresetDocPath, "utf8");
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
    presetRuleLinksByPresetName.allStrict.join("\n")
);

const updatedRecommendedPresetContent = replaceSection(
    recommendedPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName.recommended.join("\n")
);

const updatedStrictPresetContent = replaceSection(
    strictPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName.strict.join("\n")
);

const updatedStrictTypeCheckedPresetContent = replaceSection(
    strictTypeCheckedPresetContent,
    "Rules in this preset",
    presetRuleLinksByPresetName.strictTypeChecked.join("\n")
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
