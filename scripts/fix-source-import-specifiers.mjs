import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";

/** @typedef {readonly [prefix: string, specifier: string, suffix: string]} SpecifierParts */

const sourceRoot = path.resolve("src");

/** @returns {readonly string[]} */
const listSourceTypeScriptFiles = () => {
    /** @type {string[]} */
    const filePaths = [];

    /** @param {string} directoryPath */
    const walk = (directoryPath) => {
        for (const entry of readdirSync(directoryPath, {
            withFileTypes: true,
        })) {
            const fullPath = path.join(directoryPath, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
                continue;
            }

            if (entry.isFile() && fullPath.endsWith(".ts")) {
                filePaths.push(fullPath);
            }
        }
    };

    walk(sourceRoot);

    return filePaths;
};

/**
 * @param {string} specifier
 *
 * @returns {boolean}
 */
const hasRuntimeExtension = (specifier) =>
    /\.(?:[cm]?js|json|node)$/u.test(specifier);

/**
 * @param {string} specifier
 *
 * @returns {boolean}
 */
const hasTypeScriptExtension = (specifier) =>
    /\.(?:[cm]?ts|tsx)$/u.test(specifier);

/**
 * @param {string} specifier
 *
 * @returns {boolean}
 */
const shouldRewriteSpecifier = (specifier) => {
    if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
        return false;
    }

    if (specifier.endsWith("/")) {
        return false;
    }

    if (hasRuntimeExtension(specifier)) {
        return false;
    }

    if (hasTypeScriptExtension(specifier)) {
        return true;
    }

    return !/\.[a-z0-9]+$/iu.test(specifier);
};

/**
 * @param {SpecifierParts} parts
 *
 * @returns {string}
 */
const rewriteSpecifierMatch = ([
    prefix,
    specifier,
    suffix,
]) => {
    if (!shouldRewriteSpecifier(specifier)) {
        return `${prefix}${specifier}${suffix}`;
    }

    const normalizedSpecifier = hasTypeScriptExtension(specifier)
        ? specifier.replace(/\.(?:[cm]?ts|tsx)$/u, ".js")
        : `${specifier}.js`;

    return `${prefix}${normalizedSpecifier}${suffix}`;
};

/**
 * @param {string} fileContent
 *
 * @returns {string}
 */
const rewriteFileContent = (fileContent) => {
    let rewritten = fileContent;

    rewritten = rewritten.replace(
        /(from\s+["'])(\.?\.?\/[^"']+)(["'])/gu,
        (_fullMatch, prefix, specifier, suffix) =>
            rewriteSpecifierMatch([
                prefix,
                specifier,
                suffix,
            ])
    );

    rewritten = rewritten.replace(
        /(import\(\s*["'])(\.?\.?\/[^"']+)(["']\s*\))/gu,
        (_fullMatch, prefix, specifier, suffix) =>
            rewriteSpecifierMatch([
                prefix,
                specifier,
                suffix,
            ])
    );

    return rewritten;
};

const sourceFiles = listSourceTypeScriptFiles();
let changedFileCount = 0;

for (const filePath of sourceFiles) {
    const originalContent = readFileSync(filePath, "utf8");
    const rewrittenContent = rewriteFileContent(originalContent);

    if (rewrittenContent !== originalContent) {
        writeFileSync(filePath, rewrittenContent, "utf8");
        changedFileCount += 1;
    }
}

console.log(
    `Rewrote NodeNext import specifiers in ${changedFileCount}/${sourceFiles.length} source TypeScript files.`
);
