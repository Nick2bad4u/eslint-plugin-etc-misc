#!/usr/bin/env node

/** Run Docusaurus with Node-version-compatible warning controls. */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const webStorageFlag = "--no-experimental-webstorage";

const docusaurusPackagePath = fileURLToPath(
    import.meta.resolve("@docusaurus/core/package.json")
);
const docusaurusCliPath = resolve(
    dirname(docusaurusPackagePath),
    "bin/docusaurus.mjs"
);

/**
 * Build the Node arguments for the Docusaurus child process.
 *
 * Node 20.19 is supported by this repository but predates the Web Storage
 * option. Check the runtime's own allowlist before passing the option.
 *
 * @param {readonly string[]} forwardedArguments Docusaurus CLI arguments.
 * @param {ReadonlySet<string>} [allowedFlags] Flags supported by the runtime.
 *
 * @returns {string[]} Node arguments for the Docusaurus child process.
 */
export const getDocusaurusNodeArguments = (
    forwardedArguments,
    allowedFlags = process.allowedNodeEnvironmentFlags
) => [
    ...(allowedFlags.has(webStorageFlag) ? [webStorageFlag] : []),
    docusaurusCliPath,
    ...forwardedArguments,
];

const invokedPath = process.argv[1];
const isMain =
    invokedPath !== undefined &&
    pathToFileURL(resolve(invokedPath)).href === import.meta.url;

if (isMain) {
    const result = spawnSync(
        process.execPath,
        getDocusaurusNodeArguments(process.argv.slice(2)),
        {
            env: process.env,
            stdio: "inherit",
            windowsHide: true,
        }
    );

    if (result.error !== undefined) {
        throw result.error;
    }

    if (result.status === null) {
        throw new Error("Docusaurus terminated without an exit status.");
    }

    process.exitCode = result.status;
}
