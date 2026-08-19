#!/usr/bin/env node

/**
 * Inspect the internal source-module graph using the repository's TypeScript
 * compiler configuration.
 */

import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

import ts from "typescript";

const supportedModes = new Set([
    "--circular",
    "--leaves",
    "--orphans",
]);
const mode = process.argv[2];

if (
    typeof mode !== "string" ||
    !supportedModes.has(mode) ||
    process.argv.length !== 3
) {
    throw new TypeError(
        "Usage: check-module-graph.mjs --circular|--leaves|--orphans"
    );
}

const repositoryRoot = process.cwd();
const sourceRoot = resolve(repositoryRoot, "src");
const tsconfigPath = resolve(repositoryRoot, "tsconfig.json");
const tsconfigResult = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

if (tsconfigResult.error !== undefined) {
    throw new Error(
        ts.formatDiagnostic(tsconfigResult.error, {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => repositoryRoot,
            getNewLine: () => "\n",
        })
    );
}

const parsedConfig = ts.parseJsonConfigFileContent(
    tsconfigResult.config,
    ts.sys,
    repositoryRoot,
    undefined,
    tsconfigPath
);

if (parsedConfig.errors.length > 0) {
    throw new Error(
        ts.formatDiagnostics(parsedConfig.errors, {
            getCanonicalFileName: (fileName) => fileName,
            getCurrentDirectory: () => repositoryRoot,
            getNewLine: () => "\n",
        })
    );
}

/**
 * Normalize a path for use as a graph key.
 *
 * @param {string} filePath
 *
 * @returns {string}
 */
const canonicalPath = (filePath) => {
    const absolutePath = resolve(filePath);

    return ts.sys.useCaseSensitiveFileNames
        ? absolutePath
        : absolutePath.toLowerCase();
};

const sourceRootPrefix = `${canonicalPath(sourceRoot)}${sep}`;
const sourceFilePaths = parsedConfig.fileNames.filter(
    (filePath) =>
        canonicalPath(filePath).startsWith(sourceRootPrefix) &&
        !filePath.endsWith(".d.ts")
);
const sourceFileByCanonicalPath = new Map(
    sourceFilePaths.map((filePath) => [canonicalPath(filePath), filePath])
);
/** @type {Map<string, Set<string>>} */
const graph = new Map();

for (const sourceFilePath of sourceFilePaths) {
    const sourceText = readFileSync(sourceFilePath, "utf8");
    const preprocessedSource = ts.preProcessFile(sourceText, true, true);
    const dependencies = new Set();

    for (const importedFile of preprocessedSource.importedFiles) {
        const resolution = ts.resolveModuleName(
            importedFile.fileName,
            sourceFilePath,
            parsedConfig.options,
            ts.sys
        ).resolvedModule;
        const resolvedPath = resolution?.resolvedFileName;

        if (resolvedPath === undefined) {
            continue;
        }

        const dependencyPath = sourceFileByCanonicalPath.get(
            canonicalPath(resolvedPath)
        );

        if (dependencyPath !== undefined) {
            dependencies.add(dependencyPath);
        }
    }

    graph.set(sourceFilePath, dependencies);
}

/**
 * Render a repository-relative path consistently on every platform.
 *
 * @param {string} filePath
 *
 * @returns {string}
 */
const toDisplayPath = (filePath) =>
    relative(repositoryRoot, filePath).split(sep).join("/");

if (mode === "--circular") {
    /** @type {Map<string, "visited" | "visiting">} */
    const state = new Map();
    /** @type {string[]} */
    const stack = [];

    /**
     * Find the first cycle reachable from a source file.
     *
     * @param {string} filePath
     *
     * @returns {string[] | null}
     */
    const findCycle = (filePath) => {
        state.set(filePath, "visiting");
        stack.push(filePath);

        for (const dependencyPath of graph.get(filePath) ?? []) {
            const dependencyState = state.get(dependencyPath);

            if (dependencyState === "visiting") {
                const cycleStart = stack.indexOf(dependencyPath);

                return [...stack.slice(cycleStart), dependencyPath];
            }

            if (dependencyState !== "visited") {
                const cycle = findCycle(dependencyPath);

                if (cycle !== null) {
                    return cycle;
                }
            }
        }

        stack.pop();
        state.set(filePath, "visited");

        return null;
    };

    for (const filePath of graph.keys()) {
        if (state.has(filePath)) {
            continue;
        }

        const cycle = findCycle(filePath);

        if (cycle !== null) {
            console.error(
                `Circular dependency: ${cycle.map(toDisplayPath).join(" -> ")}`
            );
            process.exitCode = 1;
            break;
        }
    }

    if (process.exitCode !== 1) {
        console.log("No circular dependencies found.");
    }
} else {
    /** @type {string[]} */
    const matchingPaths = [];

    if (mode === "--leaves") {
        for (const [filePath, dependencies] of graph) {
            if (dependencies.size === 0) {
                matchingPaths.push(filePath);
            }
        }
    } else {
        const referencedPaths = new Set(
            [...graph.values()].flatMap((dependencies) => [...dependencies])
        );

        for (const filePath of graph.keys()) {
            if (!referencedPaths.has(filePath)) {
                matchingPaths.push(filePath);
            }
        }
    }

    for (const filePath of matchingPaths.toSorted()) {
        console.log(toDisplayPath(filePath));
    }
}
