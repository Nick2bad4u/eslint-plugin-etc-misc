import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const thisFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(thisFilePath);
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");

const rulesDirectoryPath = path.join(repositoryRootPath, "src", "rules");
const ruleDocsDirectoryPath = path.join(repositoryRootPath, "docs", "rules");
const ruleCatalogAssignmentsPath = path.join(
    repositoryRootPath,
    "src",
    "_internal",
    "rule-catalog-assignments.json"
);

const ruleCatalogMarkerPrefix = "> **Rule catalog ID:**";
const defaultFurtherReadingLink =
    "- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)";
const furtherReadingHeadingPattern = /^##\s+Further\s+reading\s*$/imu;
const existingCatalogMarkerPattern =
    /^> \*\*Rule catalog ID:\*\* R\d{3}\s*\n?/gmu;

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

const ruleNames = new Set(ruleFileNames.map(toRuleNameFromFileName));
const parsedCatalogAssignments = JSON.parse(
    await readFile(ruleCatalogAssignmentsPath, "utf8")
);

if (
    typeof parsedCatalogAssignments !== "object" ||
    parsedCatalogAssignments === null ||
    Array.isArray(parsedCatalogAssignments)
) {
    throw new TypeError("Rule catalog assignments must be a JSON object.");
}

const seenCatalogIndexes = new Set();
const ruleCatalogEntries = [];

for (const [ruleName, assignment] of Object.entries(parsedCatalogAssignments)) {
    if (
        typeof assignment !== "object" ||
        assignment === null ||
        Array.isArray(assignment)
    ) {
        throw new TypeError(
            `Rule catalog assignment for ${ruleName} must be an object.`
        );
    }

    const { catalogIndex, status } = assignment;

    if (!Number.isSafeInteger(catalogIndex) || catalogIndex < 1) {
        throw new TypeError(
            `Rule catalog index for ${ruleName} must be a positive safe integer.`
        );
    }

    if (seenCatalogIndexes.has(catalogIndex)) {
        throw new Error(`Duplicate rule catalog index R${catalogIndex}.`);
    }

    seenCatalogIndexes.add(catalogIndex);

    if (status !== "active" && status !== "retired") {
        throw new TypeError(
            `Rule catalog status for ${ruleName} must be active or retired.`
        );
    }

    if (status === "retired") {
        if (ruleNames.has(ruleName)) {
            throw new Error(
                `Retired rule catalog entry ${ruleName} still has a source module.`
            );
        }

        continue;
    }

    if (!ruleNames.has(ruleName)) {
        throw new Error(
            `Active rule catalog entry ${ruleName} has no source module.`
        );
    }

    ruleCatalogEntries.push({
        catalogId: `R${`${catalogIndex}`.padStart(3, "0")}`,
        catalogIndex,
        docId: toRuleDocId(ruleName),
        isTypeScriptRule: ruleName.startsWith("typescript/"),
        ruleName,
    });
}

for (const ruleName of ruleNames) {
    if (!Object.hasOwn(parsedCatalogAssignments, ruleName)) {
        throw new Error(
            `Rule ${ruleName} has no persistent catalog assignment. Allocate the next unused R### id explicitly.`
        );
    }
}

ruleCatalogEntries.sort(
    (leftEntry, rightEntry) => leftEntry.catalogIndex - rightEntry.catalogIndex
);

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
