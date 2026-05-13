import { rm } from "node:fs/promises";
import { resolve } from "node:path";

import { glob } from "tinyglobby";

const patterns = process.argv.slice(2);

if (patterns.length === 0) {
    process.stderr.write(
        "Usage: node scripts/remove-paths.mjs <path-or-glob>...\n"
    );
    process.exitCode = 1;
} else {
    const matches = await glob(patterns, {
        absolute: true,
        dot: true,
        onlyFiles: false,
    });

    const uniquePaths = [
        ...new Set(matches.map((pathValue) => resolve(pathValue))),
    ];

    await Promise.allSettled(
        uniquePaths.map(async (targetPath) => {
            await rm(targetPath, {
                force: true,
                maxRetries: 2,
                recursive: true,
            });
        })
    );
}
