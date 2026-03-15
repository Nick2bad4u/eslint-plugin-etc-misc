/**
 * @packageDocumentation
 * Runs circular dependency checks via Madge and reports only pass/fail output.
 */

import madge from "madge";

/** @type {import("madge").MadgeConfig} */
const madgeConfig = {
    excludeRegExp: [
        /(^|[\\/])(test|dist|node_modules|cache|\.cache|coverage|build|eslint-inspector|temp|\.docusaurus)($|[\\/])|\.css$/u,
    ],
    fileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "mjs",
        "cjs",
        "cts",
        "mts",
    ],
    tsConfig: "tsconfig.json",
};

try {
    const dependencyGraph = await madge("./src", madgeConfig);
    const circularDependencies = dependencyGraph.circular();

    if (circularDependencies.length === 0) {
        console.log("✅ No circular dependency found!");
        process.exit(0);
    }

    console.error("❌ Circular dependencies found:");
    for (const cycle of circularDependencies) {
        console.error(`  - ${cycle.join(" -> ")}`);
    }
    process.exit(1);
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to run circular dependency check: ${message}`);
    process.exit(1);
}
