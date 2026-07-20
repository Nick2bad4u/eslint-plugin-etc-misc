#!/usr/bin/env node

import assert from "node:assert/strict";
import { createRequire } from "node:module";

import packageJson from "../package.json" with { type: "json" };
import esmPlugin from "../dist/plugin.js";

const requireCommonJsModule = createRequire(import.meta.url);
const cjsPlugin = requireCommonJsModule("../dist/plugin.cjs");

assert.equal(
    esmPlugin.meta.version,
    packageJson.version,
    "The ESM plugin metadata version must match package.json."
);
assert.equal(
    cjsPlugin.meta.version,
    packageJson.version,
    "The CommonJS plugin metadata version must match package.json."
);

console.log(
    `Verified ESM and CommonJS plugin metadata for v${packageJson.version}.`
);
