#!/usr/bin/env node

/** Run Knip with the repository's shared resource and configuration options. */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const knipCliPath = fileURLToPath(
    new URL("../bin/knip.js", import.meta.resolve("knip"))
);
const forwardedArguments = process.argv.slice(2);

// npm 12 forwards a literal separator when callers use the extra delimiter
// required for option-like script arguments.
if (forwardedArguments[0] === "--") {
    forwardedArguments.shift();
}

const result = spawnSync(
    process.execPath,
    [
        knipCliPath,
        "-c",
        "knip.config.ts",
        "--cache",
        "--cache-location",
        ".cache/knip",
        "--no-config-hints",
        "--tsConfig",
        "tsconfig.json",
        ...forwardedArguments,
    ],
    {
        env: {
            ...process.env,
            NODE_NO_WARNINGS: "1",
            NODE_OPTIONS: "--max_old_space_size=4096",
        },
        stdio: "inherit",
        windowsHide: true,
    }
);

if (result.error !== undefined) {
    throw result.error;
}

if (result.status === null) {
    throw new Error("Knip terminated without an exit status.");
}

process.exitCode = result.status;
