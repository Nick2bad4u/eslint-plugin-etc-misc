import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisFilePath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(thisFilePath);
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");

const ruleDocsDirectoryPath = path.join(repositoryRootPath, "docs", "rules");
const ruleCatalogMapPath = path.join(
    ruleDocsDirectoryPath,
    "rule-catalog-map.json"
);

const excludedRuleDocIds = new Set(["overview", "getting-started"]);

const canonicalSections = [
    "Targeted pattern scope",
    "What this rule reports",
    "Why this rule exists",
    "❌ Incorrect",
    "✅ Correct",
    "Deprecated",
    "Behavior and migration notes",
    "Additional examples",
    "ESLint flat config example",
    "When not to use it",
    "Package documentation",
    "Further reading",
    "Adoption resources",
];

const sectionHeadingPattern = /^##\s+(.+?)\s*$/gmu;
const catalogMarkerPattern = /^> \*\*Rule catalog ID:\*\*\s*(R\d{3})\s*$/gmu;

const toNamespaceRuleName = (ruleName) => `etc-misc/${ruleName}`;

const toTypeCheckingNotice =
    "⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.";

const ensureTrailingNewline = (value) =>
    value.endsWith("\n") ? value : `${value}\n`;

const getSectionByAnyHeading = (existingSections, headingNames) => {
    for (const headingName of headingNames) {
        const value = existingSections.get(headingName);

        if (typeof value === "string" && value.trim().length > 0) {
            return value;
        }
    }

    return undefined;
};

const collectLevel3Headings = (sectionBody) => {
    const matches = sectionBody.matchAll(/^###\s+(.+?)\s*$/gmu);

    return [...matches].map((match) => ({
        headingName: match[1]?.trim() ?? "",
        index: match.index ?? 0,
        rawHeading: match[0] ?? "",
    }));
};

const extractNestedSubsection = (sectionBody, subsectionHeading) => {
    if (typeof sectionBody !== "string" || sectionBody.trim().length === 0) {
        return undefined;
    }

    const subheadings = collectLevel3Headings(sectionBody);
    const targetIndex = subheadings.findIndex(
        (subheading) => subheading.headingName === subsectionHeading
    );

    if (targetIndex === -1) {
        return undefined;
    }

    const targetSubheading = subheadings[targetIndex];
    const nextSubheading = subheadings[targetIndex + 1];
    const bodyStart =
        targetSubheading.index + targetSubheading.rawHeading.length;
    const bodyEnd = nextSubheading?.index ?? sectionBody.length;
    const body = sectionBody.slice(bodyStart, bodyEnd).trim();

    return body.length > 0 ? body : undefined;
};

const stripNestedSubsection = (sectionBody, subsectionHeading) => {
    if (typeof sectionBody !== "string" || sectionBody.trim().length === 0) {
        return sectionBody;
    }

    const subheadings = collectLevel3Headings(sectionBody);
    const targetIndex = subheadings.findIndex(
        (subheading) => subheading.headingName === subsectionHeading
    );

    if (targetIndex === -1) {
        return sectionBody;
    }

    const targetSubheading = subheadings[targetIndex];
    const nextSubheading = subheadings[targetIndex + 1];
    const sectionStart = targetSubheading.index;
    const sectionEnd = nextSubheading?.index ?? sectionBody.length;

    return `${sectionBody.slice(0, sectionStart)}${sectionBody.slice(sectionEnd)}`.trim();
};

const getSectionContentMap = (content) => {
    const matches = [...content.matchAll(sectionHeadingPattern)];
    const sectionMap = new Map();

    for (const [index, match] of matches.entries()) {
        const heading = match[1]?.trim() ?? "";
        const start = match.index ?? 0;
        const bodyStart = start + match[0].length;
        const nextStart =
            index + 1 < matches.length
                ? (matches[index + 1].index ?? content.length)
                : content.length;
        const rawBody = content
            .slice(bodyStart, nextStart)
            .replace(/^\s+/u, "");

        sectionMap.set(heading, rawBody.trimEnd());
    }

    return sectionMap;
};

const getHeadingBody = (existingSections, heading, fallbackBody) => {
    const current = existingSections.get(heading);

    if (typeof current === "string" && current.trim().length > 0) {
        return current;
    }

    return fallbackBody.trimEnd();
};

const isPlaceholderExampleBody = (body) => {
    const normalizedBody = body.trim();

    if (normalizedBody.length === 0) {
        return true;
    }

    if (
        normalizedBody.includes("Example that violates this rule") ||
        normalizedBody.includes("Example that follows this rule")
    ) {
        return true;
    }

    const fenceCount = (normalizedBody.match(/```/gu) ?? []).length;

    return fenceCount < 2;
};

const toGeneratedSections = ({
    existingSections,
    isTypeCheckedRule,
    namespaceRuleName,
}) => {
    const configExample = `\`\`\`ts\nimport etcMisc from \"eslint-plugin-etc-misc\";\n\nexport default [\n    {\n        plugins: { \"etc-misc\": etcMisc },\n        rules: {\n            \"${namespaceRuleName}\": \"error\",\n        },\n    },\n];\n\`\`\``;

    const packageDocumentationBody =
        "- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)";

    const furtherReadingBody =
        "- [ESLint custom rules and rule docs](https://eslint.org/docs/latest/extend/custom-rules)";

    const defaultBodies = new Map([
        [
            "Targeted pattern scope",
            "This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.",
        ],
        [
            "What this rule reports",
            "This rule reports code that violates the enforced convention for this rule.",
        ],
        [
            "Why this rule exists",
            "Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.",
        ],
        ["❌ Incorrect", "```ts\n// Example that violates this rule.\n```"],
        ["✅ Correct", "```ts\n// Example that follows this rule.\n```"],
        [
            "Behavior and migration notes",
            "Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.",
        ],
        [
            "Additional examples",
            "```ts\n// Add project-specific examples here when edge cases matter.\n```",
        ],
        ["ESLint flat config example", configExample],
        [
            "When not to use it",
            "Disable this rule when your project intentionally uses a different, documented convention and the tradeoffs are understood.",
        ],
        ["Package documentation", packageDocumentationBody],
        ["Further reading", furtherReadingBody],
        [
            "Adoption resources",
            "- Start at warning level in CI, then move to error after cleanup.\n- Use focused codemods/autofix batches per package or directory.",
        ],
    ]);

    const legacyRuleDetails = getSectionByAnyHeading(existingSections, [
        "Rule Details",
        "Rule details",
    ]);
    const currentWhatThisRuleReports = getSectionByAnyHeading(
        existingSections,
        ["What this rule reports"]
    );
    const legacyOptions = getSectionByAnyHeading(existingSections, ["Options"]);
    const legacyStatus = getSectionByAnyHeading(existingSections, ["Status"]);
    const legacyTypeChecking = getSectionByAnyHeading(existingSections, [
        "Type Checking",
    ]);
    const legacyWhenNotToUseIt = getSectionByAnyHeading(existingSections, [
        "When Not To Use It",
        "When not to use it",
    ]);
    const legacyFurtherReading = getSectionByAnyHeading(existingSections, [
        "Further Reading",
        "Further reading",
    ]);

    const incorrectExampleFromNestedSection = extractNestedSubsection(
        currentWhatThisRuleReports,
        "❌ Incorrect"
    );
    const correctExampleFromNestedSection = extractNestedSubsection(
        currentWhatThisRuleReports,
        "✅ Correct"
    );

    if (typeof legacyRuleDetails === "string") {
        defaultBodies.set(
            "What this rule reports",
            stripNestedSubsection(
                stripNestedSubsection(legacyRuleDetails, "❌ Incorrect"),
                "✅ Correct"
            )
        );
    }

    if (typeof currentWhatThisRuleReports === "string") {
        defaultBodies.set(
            "What this rule reports",
            stripNestedSubsection(
                stripNestedSubsection(
                    currentWhatThisRuleReports,
                    "❌ Incorrect"
                ),
                "✅ Correct"
            )
        );
    }

    if (typeof incorrectExampleFromNestedSection === "string") {
        defaultBodies.set("❌ Incorrect", incorrectExampleFromNestedSection);
    }

    if (typeof correctExampleFromNestedSection === "string") {
        defaultBodies.set("✅ Correct", correctExampleFromNestedSection);
    }

    if (typeof legacyOptions === "string") {
        const currentBehaviorNotes =
            defaultBodies.get("Behavior and migration notes") ?? "";

        defaultBodies.set(
            "Behavior and migration notes",
            `${currentBehaviorNotes}\n\n### Options\n\n${legacyOptions}`
        );
    }

    if (typeof legacyStatus === "string") {
        const currentBehaviorNotes =
            defaultBodies.get("Behavior and migration notes") ?? "";

        defaultBodies.set(
            "Behavior and migration notes",
            `${currentBehaviorNotes}\n\n### Status\n\n${legacyStatus}`
        );
    }

    if (typeof legacyTypeChecking === "string") {
        const currentTargetScope =
            defaultBodies.get("Targeted pattern scope") ?? "";

        defaultBodies.set(
            "Targeted pattern scope",
            `${currentTargetScope}\n\n### Type checking\n\n${legacyTypeChecking}`
        );
    }

    if (typeof legacyWhenNotToUseIt === "string") {
        defaultBodies.set("When not to use it", legacyWhenNotToUseIt);
    }

    if (typeof legacyFurtherReading === "string") {
        defaultBodies.set("Further reading", legacyFurtherReading);
    }

    if (isTypeCheckedRule) {
        const currentScopeBody = getHeadingBody(
            existingSections,
            "Targeted pattern scope",
            defaultBodies.get("Targeted pattern scope")
        );

        defaultBodies.set(
            "Targeted pattern scope",
            `${toTypeCheckingNotice}\n\n${currentScopeBody}`
        );
    }

    const hasDeprecatedContent =
        typeof getSectionByAnyHeading(existingSections, ["Deprecated"]) ===
            "string" ||
        (typeof legacyStatus === "string" && /deprecated/iu.test(legacyStatus));

    if (hasDeprecatedContent) {
        const deprecatedBody =
            getSectionByAnyHeading(existingSections, ["Deprecated"]) ??
            legacyStatus ??
            "This rule is deprecated. Prefer the linked replacement in this section.";

        defaultBodies.set("Deprecated", deprecatedBody);
    }

    const sectionNames = canonicalSections.filter(
        (heading) => heading !== "Deprecated" || hasDeprecatedContent
    );

    return sectionNames.map((heading) => {
        const fallbackBody = defaultBodies.get(heading) ?? "";
        const body = getHeadingBody(existingSections, heading, fallbackBody);

        if (
            heading === "What this rule reports" &&
            (body.includes("### ❌ Incorrect") ||
                body.includes("### ✅ Correct"))
        ) {
            return `## ${heading}\n\n${fallbackBody}`.trimEnd();
        }

        if (
            heading === "❌ Incorrect" &&
            isPlaceholderExampleBody(body) &&
            typeof incorrectExampleFromNestedSection === "string"
        ) {
            return `## ${heading}\n\n${incorrectExampleFromNestedSection}`.trimEnd();
        }

        if (
            heading === "✅ Correct" &&
            isPlaceholderExampleBody(body) &&
            typeof correctExampleFromNestedSection === "string"
        ) {
            return `## ${heading}\n\n${correctExampleFromNestedSection}`.trimEnd();
        }

        return `## ${heading}\n\n${body}`.trimEnd();
    });
};

const ruleCatalogMap = JSON.parse(await readFile(ruleCatalogMapPath, "utf8"));

const ruleCatalogByDocId = new Map(
    ruleCatalogMap.map((entry) => [entry.docId, entry])
);

const ruleDocFileNames = (await readdir(ruleDocsDirectoryPath))
    .filter((fileName) => fileName.endsWith(".md"))
    .sort((left, right) => left.localeCompare(right));

for (const fileName of ruleDocFileNames) {
    const ruleDocId = fileName.replace(/\.md$/u, "");

    if (excludedRuleDocIds.has(ruleDocId)) {
        continue;
    }

    const ruleCatalogEntry = ruleCatalogByDocId.get(ruleDocId);

    if (!ruleCatalogEntry) {
        continue;
    }

    const filePath = path.join(ruleDocsDirectoryPath, fileName);
    const currentContent = await readFile(filePath, "utf8");
    const lineEnding = currentContent.includes("\r\n") ? "\r\n" : "\n";
    const normalizedContent = currentContent.replaceAll("\r\n", "\n");

    const titleMatch = normalizedContent.match(/^#\s+(.+?)\s*$/mu);
    const summaryMatch = normalizedContent.match(
        /^#\s+.+?\n+([\s\S]*?)(?:\n##\s+|$)/u
    );
    const catalogIdMatch = normalizedContent.match(catalogMarkerPattern);

    const title = titleMatch?.[1]?.trim() ?? ruleDocId;
    const summary =
        summaryMatch?.[1]?.trim() ??
        "Enforce a consistent and maintainable coding pattern for this rule.";

    const existingSections = getSectionContentMap(normalizedContent);

    const isTypeCheckedRule =
        normalizedContent.includes("requires type information") ||
        normalizedContent.includes("Type Checking") ||
        normalizedContent.includes("TypeScript-ESLint: Typed Linting");

    const sections = toGeneratedSections({
        existingSections,
        isTypeCheckedRule,
        namespaceRuleName: toNamespaceRuleName(ruleCatalogEntry.ruleName),
    });

    const catalogId = catalogIdMatch?.[1] ?? ruleCatalogEntry.catalogId;

    const packageDocumentationHeading = "## Package documentation";
    const furtherReadingHeading = "## Further reading";
    const sectionsWithCatalogMarker = sections.flatMap((section) => {
        if (!section.startsWith(furtherReadingHeading)) {
            return [section];
        }

        return [`> **Rule catalog ID:** ${catalogId}`, section];
    });

    if (
        !sectionsWithCatalogMarker.some((section) =>
            section.startsWith("> **Rule catalog ID:**")
        )
    ) {
        const packageDocumentationIndex = sectionsWithCatalogMarker.findIndex(
            (section) => section.startsWith(packageDocumentationHeading)
        );

        if (packageDocumentationIndex === -1) {
            sectionsWithCatalogMarker.push(
                `> **Rule catalog ID:** ${catalogId}`
            );
        } else {
            sectionsWithCatalogMarker.splice(
                packageDocumentationIndex + 1,
                0,
                `> **Rule catalog ID:** ${catalogId}`
            );
        }
    }

    const rebuilt = ensureTrailingNewline(
        [
            `# ${title}`,
            summary,
            ...sectionsWithCatalogMarker,
        ]
            .map((segment) => segment.trimEnd())
            .join("\n\n")
    );

    const finalContent =
        lineEnding === "\r\n" ? rebuilt.replaceAll("\n", "\r\n") : rebuilt;

    if (finalContent !== currentContent) {
        await writeFile(filePath, finalContent, "utf8");
    }
}
