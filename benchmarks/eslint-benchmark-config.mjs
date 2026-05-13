import tsParser from "@typescript-eslint/parser";
import * as path from "node:path";

import pluginExport from "../plugin.mjs";

const plugin = pluginExport;

/**
 * @typedef {Record<string, unknown>} UnknownRecord
 */

/**
 * @typedef {import("eslint").Linter.RulesRecord} BenchmarkRules
 */

/**
 * @typedef {{
 *     recommendedZeroMessageFixture: readonly string[];
 *     typedInvalidFixtures: readonly string[];
 *     typedValidFixtures: readonly string[];
 * }} BenchmarkFileGlobs
 */

/**
 * @typedef {{ rules: BenchmarkRules }} CreateBenchmarkFlatConfigOptions
 */

/**
 * Check whether a value is an object record.
 *
 * @param {unknown} value - Value to inspect.
 *
 * @returns {value is UnknownRecord} `true` when value is a non-null object.
 */
const isUnknownRecord = (value) => typeof value === "object" && value !== null;

/**
 * Absolute repository root used by parser services and benchmark paths.
 */
export const repositoryRoot = path.resolve(process.cwd());

/**
 * Shared file globs used by benchmark scenarios.
 */
/** @type {Readonly<BenchmarkFileGlobs>} */
export const benchmarkFileGlobs = Object.freeze({
    recommendedZeroMessageFixture: Object.freeze([
        "benchmarks/fixtures/recommended-zero-message.baseline.ts",
    ]),
    typedInvalidFixtures: Object.freeze([
        "benchmarks/fixtures/recommended-invalid.fixture.ts",
    ]),
    typedValidFixtures: Object.freeze([
        "benchmarks/fixtures/recommended-valid.fixture.ts",
    ]),
});

/**
 * Ensure a dynamic value is a non-null object record.
 *
 * @param {unknown} value - Value to validate.
 * @param {string} label - Error label for diagnostics.
 *
 * @returns {UnknownRecord} Normalized object record.
 *
 * @throws {TypeError} When value is not a non-null object.
 */
const ensureRecord = (value, label) => {
    if (!isUnknownRecord(value)) {
        throw new TypeError(`${label} must be a non-null object.`);
    }

    return value;
};

/**
 * Check whether a value is an ESLint rule entry.
 *
 * @param {unknown} value - Rule config candidate.
 *
 * @returns {value is import("eslint").Linter.RuleEntry} Whether value matches
 *   an ESLint rule entry shape.
 */
const isRuleEntry = (value) =>
    typeof value === "number" ||
    typeof value === "string" ||
    Array.isArray(value);

/**
 * Ensure a dynamic value is a valid ESLint rules record.
 *
 * @param {unknown} value - Value to validate.
 * @param {string} label - Error label for diagnostics.
 *
 * @returns {BenchmarkRules} Normalized rules record.
 *
 * @throws {TypeError} When value includes non-rule-entry members.
 */
const ensureRulesRecord = (value, label) => {
    const record = ensureRecord(value, label);
    /** @type {BenchmarkRules} */
    const rulesRecord = {};

    for (const [ruleName, ruleEntry] of Object.entries(record)) {
        if (!isRuleEntry(ruleEntry)) {
            throw new TypeError(
                `${label}.${ruleName} must be a valid ESLint rule entry.`
            );
        }

        rulesRecord[ruleName] = ruleEntry;
    }

    return rulesRecord;
};

/**
 * Resolve rules from a plugin preset by name.
 *
 * @param {string} presetName - Key under `plugin.configs`.
 *
 * @returns {Readonly<BenchmarkRules>} Frozen rule map suitable for flat config.
 */
const resolveRuleSet = (presetName) => {
    const configs = ensureRecord(plugin.configs, "plugin.configs");
    const preset = ensureRecord(
        configs[presetName],
        `plugin.configs.${presetName}`
    );
    const rules = ensureRulesRecord(
        preset["rules"],
        `${presetName} preset rules`
    );

    return Object.freeze({ ...rules });
};

/**
 * Plugin rule sets used by benchmark scenarios.
 */

/**
 * @typedef {Readonly<{
 *     all: Readonly<BenchmarkRules>;
 *     minimal: Readonly<BenchmarkRules>;
 *     recommended: Readonly<BenchmarkRules>;
 *     strict: Readonly<BenchmarkRules>;
 * }>} BenchmarkRuleSets
 */

/** @type {BenchmarkRuleSets} */
export const benchmarkRuleSets = Object.freeze({
    all: resolveRuleSet("all"),
    minimal: resolveRuleSet("minimal"),
    recommended: resolveRuleSet("recommended"),
    strict: resolveRuleSet("strict"),
});

/**
 * Create a flat ESLint config array for benchmark scenarios.
 *
 * @param {CreateBenchmarkFlatConfigOptions} options - Config creation options.
 *
 * @returns {import("eslint").Linter.Config[]} Flat config array for ESLint Node
 *   API / CLI usage.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- This .mjs module relies on JSDoc contracts instead of TS syntax.
export function createBenchmarkFlatConfig(options) {
    const { rules } = options;
    const pluginModule = /** @type {import("eslint").ESLint.Plugin} */ (
        /** @type {unknown} */ (plugin)
    );

    return [
        {
            files: ["**/*.{ts,tsx,mts,cts}"],
            languageOptions: {
                parser: tsParser,
                parserOptions: {
                    ecmaVersion: "latest",
                    project: "./tsconfig.eslint.json",
                    sourceType: "module",
                    tsconfigRootDir: repositoryRoot,
                },
            },
            name: "benchmark:etc-misc",
            plugins: {
                "etc-misc": pluginModule,
            },
            rules,
        },
    ];
}
