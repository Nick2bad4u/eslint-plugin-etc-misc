#!/usr/bin/env node

/**
 * Install or verify the exact npm version declared by package.json.
 *
 * CI uses `--install` immediately after setting up Node. Repository checks use
 * `--check` so a developer's global package manager is never changed
 * implicitly.
 */

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(
    new URL("../package.json", import.meta.url)
);

const argument = process.argv[2] ?? "--check";

if (!["--check", "--install"].includes(argument) || process.argv.length > 3) {
    throw new TypeError("Usage: setup-package-manager.mjs [--check|--install]");
}

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const packageManager = packageJson.packageManager;

if (typeof packageManager !== "string") {
    throw new TypeError("package.json packageManager must be a string.");
}

const packageManagerMatch = /^npm@(\d+\.\d+\.\d+)$/v.exec(packageManager);

if (packageManagerMatch?.[1] === undefined) {
    throw new TypeError(
        "package.json packageManager must pin npm to an exact x.y.z version."
    );
}

const expectedVersion = packageManagerMatch[1];

/**
 * Run npm through the platform shell so Windows can resolve npm.cmd. Every
 * command is static except for the exact-semver value validated above.
 *
 * @param {string} command
 * @param {import("node:child_process").SpawnSyncOptions} [options]
 *
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
const runNpm = (command, options = {}) =>
    spawnSync(command, {
        ...options,
        encoding: "utf8",
        shell: true,
        windowsHide: true,
    });

/**
 * Resolve the npm version available on PATH.
 *
 * @returns {string}
 */
const readInstalledVersion = () => {
    const result = runNpm("npm --version", {});

    if (result.status !== 0) {
        throw new Error(
            `Unable to run npm --version: ${result.stderr.trim() || "unknown error"}`
        );
    }

    return result.stdout.trim();
};

let installedVersion = readInstalledVersion();

if (installedVersion !== expectedVersion && argument === "--install") {
    const installResult = runNpm(
        `npm install --global --ignore-scripts --no-audit --no-fund npm@${expectedVersion}`,
        { stdio: "inherit" }
    );

    if (installResult.status !== 0) {
        throw new Error(`Failed to install npm@${expectedVersion}.`);
    }

    installedVersion = readInstalledVersion();
}

if (installedVersion !== expectedVersion) {
    throw new Error(
        `Expected npm ${expectedVersion}, but npm ${installedVersion} is active. Run "node scripts/setup-package-manager.mjs --install".`
    );
}

console.log(`Verified npm ${installedVersion}.`);
