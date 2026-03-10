import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(thisFilePath);
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");

const recommendedConfigPath = path.join(
    repositoryRootPath,
    "src",
    "configs",
    "recommended.ts"
);
const allPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "all.md"
);
const recommendedPresetDocPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "presets",
    "recommended.md"
);
const ruleCatalogMapPath = path.join(
    repositoryRootPath,
    "docs",
    "rules",
    "rule-catalog-map.json"
);

const extractRuleNamesFromRecommendedConfig = (sourceText) => {
    const ruleNameMatches = sourceText.matchAll(
        /"etc-misc\/([^"]+)"\s*:\s*"error"/gmu
    );

    return [...ruleNameMatches].map((match) => match[1] ?? "").filter(Boolean);
};

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

const recommendedConfigText = await readFile(recommendedConfigPath, "utf8");
const ruleCatalogMap = JSON.parse(await readFile(ruleCatalogMapPath, "utf8"));

const catalogByRuleName = new Map(
    ruleCatalogMap.map((entry) => [entry.ruleName, entry])
);

const recommendedRuleNames = extractRuleNamesFromRecommendedConfig(
    recommendedConfigText
);

const recommendedRuleLinks = recommendedRuleNames.map((ruleName) => {
    const entry = catalogByRuleName.get(ruleName);

    if (!entry) {
        throw new Error(
            `Missing catalog entry for recommended rule: ${ruleName}`
        );
    }

    return toPresetRuleLinkLine({
        catalogId: entry.catalogId,
        docId: toDocId(ruleName),
        ruleName,
    });
});

const allCoreRuleLinks = ruleCatalogMap
    .filter((entry) => !entry.ruleName.startsWith("typescript/"))
    .map((entry) => toPresetRuleLinkLine(entry));

const allTypeScriptRuleLinks = ruleCatalogMap
    .filter((entry) => entry.ruleName.startsWith("typescript/"))
    .map((entry) => toPresetRuleLinkLine(entry));

const recommendedPresetContent = await readFile(
    recommendedPresetDocPath,
    "utf8"
);
const allPresetContent = await readFile(allPresetDocPath, "utf8");

const updatedRecommendedPresetContent = replaceSection(
    recommendedPresetContent,
    "Rules in this preset",
    recommendedRuleLinks.join("\n")
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

await writeFile(
    recommendedPresetDocPath,
    updatedRecommendedPresetContent,
    "utf8"
);
await writeFile(allPresetDocPath, updatedAllPresetContent, "utf8");
