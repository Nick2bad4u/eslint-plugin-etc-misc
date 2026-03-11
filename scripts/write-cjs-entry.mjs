import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptsDirectoryPath = path.dirname(scriptPath);
const repositoryRootPath = path.resolve(scriptsDirectoryPath, "..");
const distDirectoryPath = path.join(repositoryRootPath, "dist");
const cjsEntryPath = path.join(distDirectoryPath, "plugin.cjs");
const cjsDeclarationPath = path.join(distDirectoryPath, "plugin.d.cts");

const cjsEntryContents = [
    '"use strict";',
    'const pluginModule = require("./plugin.js");',
    "const plugin = pluginModule.default ?? pluginModule;",
    "module.exports = plugin;",
    "",
].join("\n");

const cjsDeclarationContents = [
    'import plugin from "./plugin.js";',
    "export = plugin;",
    "",
].join("\n");

await mkdir(distDirectoryPath, { recursive: true });
await writeFile(cjsEntryPath, cjsEntryContents, "utf8");
await writeFile(cjsDeclarationPath, cjsDeclarationContents, "utf8");

process.stdout.write("Wrote dist/plugin.cjs and dist/plugin.d.cts wrappers.\n");
