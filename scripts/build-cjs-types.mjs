#!/usr/bin/env node

/**
 * Generate the CommonJS declaration entrypoint from TypeScript's ESM output.
 *
 * The runtime CommonJS bundle assigns the plugin object directly to
 * `module.exports`, so its declaration must use `export =` instead of making
 * consumers access an artificial `.default` property.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const esmDeclarationPath = fileURLToPath(
    new URL("../dist/plugin.d.ts", import.meta.url)
);
const cjsDeclarationPath = fileURLToPath(
    new URL("../dist/plugin.d.cts", import.meta.url)
);
const esmDefaultExportPattern =
    /export default plugin;\r?\n\/\/# sourceMappingURL=plugin\.d\.ts\.map\r?\n?$/v;

const esmDeclaration = await readFile(esmDeclarationPath, "utf8");

if (!esmDefaultExportPattern.test(esmDeclaration)) {
    throw new Error(
        "Expected dist/plugin.d.ts to end with the plugin default export and source-map reference."
    );
}

const cjsDeclaration = esmDeclaration.replace(
    esmDefaultExportPattern,
    "export = plugin;\n"
);

await writeFile(cjsDeclarationPath, cjsDeclaration, "utf8");
