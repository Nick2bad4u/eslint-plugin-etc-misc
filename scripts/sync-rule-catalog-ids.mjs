import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const thisFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(thisFilePath);
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");

const rulesDirectoryPath = path.join(repositoryRootPath, "src", "rules");
const ruleDocsDirectoryPath = path.join(repositoryRootPath, "docs", "rules");

const ruleCatalogMarkerPrefix = "> **Rule catalog ID:**";
const defaultFurtherReadingLink =
    "- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)";
const furtherReadingHeadingPattern = /^##\s+Further\s+reading\s*$/imu;
const existingCatalogMarkerPattern =
    /^> \*\*Rule catalog ID:\*\* R\d{3}\s*\n?/gmu;

/**
 * @param {string} leftRuleName
 * @param {string} rightRuleName
 *
 * @returns {number}
 */
const compareRuleNamesForCatalog = (leftRuleName, rightRuleName) => {
    const leftIsTypeScriptRule = leftRuleName.startsWith("typescript/");
    const rightIsTypeScriptRule = rightRuleName.startsWith("typescript/");

    if (leftIsTypeScriptRule !== rightIsTypeScriptRule) {
        return leftIsTypeScriptRule ? 1 : -1;
    }

    return leftRuleName.localeCompare(rightRuleName);
};

/**
 * @param {string} ruleFileName
 *
 * @returns {string}
 */
const toRuleNameFromFileName = (ruleFileName) => {
    const withoutExtension = ruleFileName.replace(/\.ts$/u, "");

    if (withoutExtension.startsWith("typescript-")) {
        return withoutExtension.replace("typescript-", "typescript/");
    }

    return withoutExtension;
};

/**
 * @param {string} ruleName
 *
 * @returns {string}
 */
const toRuleDocId = (ruleName) => ruleName.replaceAll("/", "-");

/**
 * @param {number} catalogIndex
 *
 * @returns {string}
 */
const toRuleCatalogId = (catalogIndex) =>
    `R${`${catalogIndex}`.padStart(3, "0")}`;

/**
 * @param {string} sourceText
 *
 * @returns {string}
 */
const ensureFurtherReadingSectionHasContent = (sourceText) => {
    const headingMatch = furtherReadingHeadingPattern.exec(sourceText);

    if (!headingMatch) {
        return `${sourceText.replace(/\s+$/u, "")}\n\n## Further reading\n\n${defaultFurtherReadingLink}\n`;
    }

    const headingEndIndex = headingMatch.index + headingMatch[0].length;
    const contentAfterHeading = sourceText.slice(headingEndIndex);
    const nextHeadingOffset = contentAfterHeading.search(/\n##\s+/u);
    const sectionBody =
        nextHeadingOffset === -1
            ? contentAfterHeading
            : contentAfterHeading.slice(0, nextHeadingOffset);

    if (sectionBody.trim().length > 0) {
        return sourceText;
    }

    const sectionContent = `\n\n${defaultFurtherReadingLink}\n`;

    if (nextHeadingOffset === -1) {
        return `${sourceText.replace(/\s+$/u, "")}${sectionContent}`;
    }

    return `${sourceText.slice(0, headingEndIndex)}${sectionContent}${contentAfterHeading.slice(nextHeadingOffset)}`;
};

/**
 * @param {string} sourceText
 * @param {string} catalogId
 *
 * @returns {string}
 */
const upsertCatalogIdBlock = (sourceText, catalogId) => {
    const markerLine = `${ruleCatalogMarkerPrefix} ${catalogId}`;
    const sourceWithoutCatalogMarker = sourceText
        .replace(existingCatalogMarkerPattern, "")
        .replace(/\s+$/u, "");

    const furtherReadingHeadingMatch = furtherReadingHeadingPattern.exec(
        sourceWithoutCatalogMarker
    );

    if (furtherReadingHeadingMatch) {
        const contentBeforeHeading = sourceWithoutCatalogMarker
            .slice(0, furtherReadingHeadingMatch.index)
            .replace(/\s+$/u, "");
        const headingAndFollowingContent = sourceWithoutCatalogMarker
            .slice(furtherReadingHeadingMatch.index)
            .replace(/^\s+/u, "");

        return ensureFurtherReadingSectionHasContent(
            `${contentBeforeHeading}\n\n${markerLine}\n\n${headingAndFollowingContent}\n`
        );
    }

    return ensureFurtherReadingSectionHasContent(
        `${sourceWithoutCatalogMarker}\n\n${markerLine}\n`
    );
};

/**
 * @param {string} sourceText
 *
 * @returns {string}
 */
const toUnixLineEndings = (sourceText) => sourceText.replaceAll("\r\n", "\n");

/**
 * @param {string} sourceText
 * @param {"\n" | "\r\n"} lineEnding
 *
 * @returns {string}
 */
const fromUnixLineEndings = (sourceText, lineEnding) =>
    lineEnding === "\r\n" ? sourceText.replaceAll("\n", "\r\n") : sourceText;

const ruleFileNames = (await readdir(rulesDirectoryPath))
    .filter((fileName) => fileName.endsWith(".ts"))
    .sort((leftFileName, rightFileName) =>
        leftFileName.localeCompare(rightFileName)
    );

const ruleCatalogEntries = ruleFileNames
    .map(toRuleNameFromFileName)
    .sort(compareRuleNamesForCatalog)
    .map((ruleName, zeroBasedIndex) => {
        const catalogIndex = zeroBasedIndex + 1;

        return {
            catalogId: toRuleCatalogId(catalogIndex),
            catalogIndex,
            docId: toRuleDocId(ruleName),
            isTypeScriptRule: ruleName.startsWith("typescript/"),
            ruleName,
        };
    });

const missingDocFilePaths = [];

for (const { catalogId, docId } of ruleCatalogEntries) {
    const ruleDocFilePath = path.join(ruleDocsDirectoryPath, `${docId}.md`);

    let currentContent;

    try {
        currentContent = await readFile(ruleDocFilePath, "utf8");
    } catch {
        missingDocFilePaths.push(ruleDocFilePath);
        continue;
    }

    const lineEnding = currentContent.includes("\r\n") ? "\r\n" : "\n";
    const normalizedCurrentContent = toUnixLineEndings(currentContent);
    const normalizedUpdatedContent = upsertCatalogIdBlock(
        normalizedCurrentContent,
        catalogId
    );
    const updatedContent = fromUnixLineEndings(
        normalizedUpdatedContent,
        lineEnding
    );

    if (updatedContent !== currentContent) {
        await writeFile(ruleDocFilePath, updatedContent, "utf8");
    }
}

if (missingDocFilePaths.length > 0) {
    throw new Error(
        `Missing rule docs for catalog sync:\n${missingDocFilePaths.join("\n")}`
    );
}

const catalogMapOutputPath = path.join(
    ruleDocsDirectoryPath,
    "rule-catalog-map.json"
);
await writeFile(
    catalogMapOutputPath,
    `${JSON.stringify(ruleCatalogEntries, null, 4)}\n`,
    "utf8"
);

process.stdout.write(
    `Updated catalog metadata for ${ruleCatalogEntries.length} rule docs and wrote ${path.relative(repositoryRootPath, catalogMapOutputPath)}.\n`
);
