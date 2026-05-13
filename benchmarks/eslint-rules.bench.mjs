import { ESLint } from "eslint";
import { bench, describe } from "vitest";

import {
    benchmarkFileGlobs,
    benchmarkRuleSets,
    createBenchmarkFlatConfig,
} from "./eslint-benchmark-config.mjs";

/**
 * @typedef {import("eslint").ESLint.LintResult} LintResult
 */

/**
 * @typedef {ReadonlyArray<LintResult>} LintResults
 */

/**
 * @typedef {import("eslint").Linter.RulesRecord} BenchmarkRules
 */

/**
 * @typedef {Readonly<{
 *     filePatterns: readonly string[];
 *     fix: boolean;
 *     rules: BenchmarkRules;
 * }>} LintScenarioOptions
 */

/**
 * @typedef {object} BenchmarkSignalOptions
 *
 * @property {number} [maximumReportedProblems] - Maximum allowed lint problems.
 * @property {number} [minimumReportedProblems] - Minimum required lint
 *   problems.
 */

const standardBenchmarkOptions = Object.freeze({
    iterations: 3,
    warmupIterations: 1,
});

const expensiveBenchmarkOptions = Object.freeze({
    iterations: 2,
    warmupIterations: 0,
});

/**
 * Narrow unknown values to object records.
 *
 * @param {unknown} value - Value to inspect.
 *
 * @returns {value is Record<string, unknown>} Whether the value is object-like.
 */
const isObjectRecord = (value) => typeof value === "object" && value !== null;

/**
 * Read `stats.times.passes` from an ESLint lint result.
 *
 * @param {LintResult} lintResult - ESLint lint result.
 *
 * @returns {readonly unknown[]} Lint passes (or empty array when unavailable).
 */
const getLintPasses = (lintResult) => {
    const stats = lintResult.stats;
    if (!isObjectRecord(stats)) {
        return [];
    }

    const times = stats.times;
    if (!isObjectRecord(times)) {
        return [];
    }

    const passes = times.passes;
    return Array.isArray(passes) ? passes : [];
};

/**
 * Read per-rule timing object from a lint pass.
 *
 * @param {unknown} pass - ESLint pass payload.
 *
 * @returns {null | Record<string, unknown>} Rule timing record when present.
 */
const getPassRules = (pass) => {
    if (!isObjectRecord(pass)) {
        return null;
    }

    const rules = pass["rules"];
    return isObjectRecord(rules) ? rules : null;
};

/**
 * Normalize a single rule timing object to milliseconds.
 *
 * @param {unknown} ruleTiming - Timing payload.
 *
 * @returns {number} Numeric `stats.times.passes[].rules[*].total` value.
 */
const getRuleTimingMilliseconds = (ruleTiming) => {
    if (!isObjectRecord(ruleTiming)) {
        return 0;
    }

    const total = ruleTiming["total"];
    return typeof total === "number" ? total : 0;
};

/**
 * Count lint problems so benchmark runs assert useful signal.
 *
 * @param {LintResults} lintResults - ESLint lint results.
 *
 * @returns {number} Sum of reported errors and warnings.
 */
const countReportedProblems = (lintResults) =>
    lintResults.reduce(
        (problemCount, result) =>
            problemCount + result.errorCount + result.warningCount,
        0
    );

/**
 * Sum rule execution milliseconds from ESLint stats payload.
 *
 * @param {LintResults} lintResults - ESLint lint results.
 *
 * @returns {number} Aggregate rule execution time in milliseconds.
 */
const sumRuleTimingMilliseconds = (lintResults) => {
    let totalRuleTime = 0;

    for (const result of lintResults) {
        for (const pass of getLintPasses(result)) {
            const passRules = getPassRules(pass);
            if (passRules !== null) {
                for (const ruleTiming of Object.values(passRules)) {
                    totalRuleTime += getRuleTimingMilliseconds(ruleTiming);
                }
            }
        }
    }

    return totalRuleTime;
};

/**
 * Guard benchmark outputs to ensure each case performs real lint work.
 *
 * @param {string} scenarioName - Human-friendly scenario label.
 * @param {LintResults} lintResults - ESLint lint results.
 * @param {BenchmarkSignalOptions} [options] - Signal bounds for reported
 *   problem counts.
 *
 * @throws {Error} When lint results are empty, out of expected bounds, or have
 *   no rule timing.
 */
const assertMeaningfulBenchmarkSignal = (
    scenarioName,
    lintResults,
    options
) => {
    const maximumReportedProblems =
        options?.maximumReportedProblems ?? Number.POSITIVE_INFINITY;
    const minimumReportedProblems = options?.minimumReportedProblems ?? 1;

    if (lintResults.length === 0) {
        throw new Error(`${scenarioName}: ESLint returned no lint results.`);
    }

    const reportedProblems = countReportedProblems(lintResults);
    if (reportedProblems < minimumReportedProblems) {
        throw new Error(
            `${scenarioName}: expected at least ${minimumReportedProblems} reported lint problem(s).`
        );
    }

    if (reportedProblems > maximumReportedProblems) {
        throw new Error(
            `${scenarioName}: expected at most ${maximumReportedProblems} reported lint problem(s).`
        );
    }

    const measuredRuleTime = sumRuleTimingMilliseconds(lintResults);
    if (measuredRuleTime <= 0) {
        throw new Error(
            `${scenarioName}: expected positive ESLint rule timing.`
        );
    }
};

/**
 * Run ESLint with a temporary benchmark-specific config.
 *
 * @param {LintScenarioOptions} options - File globs, fix mode, and rule set
 *   used for one benchmark run.
 *
 * @returns {Promise<LintResult[]>} Lint output for the scenario corpus.
 */
const lintScenario = async ({ filePatterns, fix, rules }) => {
    const eslint = new ESLint({
        cache: false,
        fix,
        overrideConfig: createBenchmarkFlatConfig({ rules }),
        overrideConfigFile: true,
        stats: true,
    });

    return eslint.lintFiles([...filePatterns]);
};

describe("eslint-plugin-etc-misc meaningful benchmarks", () => {
    bench(
        "recommended preset on full invalid typed fixture corpus",
        async () => {
            expect.hasAssertions();

            const lintResults = await lintScenario({
                filePatterns: benchmarkFileGlobs.typedInvalidFixtures,
                fix: false,
                rules: benchmarkRuleSets.recommended,
            });

            assertMeaningfulBenchmarkSignal(
                "recommended preset on full invalid typed fixture corpus",
                lintResults
            );
        },
        standardBenchmarkOptions
    );

    bench(
        "strict preset on full invalid typed fixture corpus",
        async () => {
            expect.hasAssertions();

            const lintResults = await lintScenario({
                filePatterns: benchmarkFileGlobs.typedInvalidFixtures,
                fix: false,
                rules: benchmarkRuleSets.strict,
            });

            assertMeaningfulBenchmarkSignal(
                "strict preset on full invalid typed fixture corpus",
                lintResults
            );
        },
        standardBenchmarkOptions
    );

    bench(
        "recommended preset on full valid typed fixture corpus",
        async () => {
            expect.hasAssertions();

            const lintResults = await lintScenario({
                filePatterns: benchmarkFileGlobs.typedValidFixtures,
                fix: false,
                rules: benchmarkRuleSets.recommended,
            });

            assertMeaningfulBenchmarkSignal(
                "recommended preset on full valid typed fixture corpus",
                lintResults,
                { minimumReportedProblems: 0 }
            );
        },
        standardBenchmarkOptions
    );

    bench(
        "recommended preset on curated zero-message corpus",
        async () => {
            expect.hasAssertions();

            const lintResults = await lintScenario({
                filePatterns: benchmarkFileGlobs.recommendedZeroMessageFixture,
                fix: false,
                rules: benchmarkRuleSets.recommended,
            });

            assertMeaningfulBenchmarkSignal(
                "recommended preset on curated zero-message corpus",
                lintResults,
                { maximumReportedProblems: 0, minimumReportedProblems: 0 }
            );
        },
        standardBenchmarkOptions
    );

    bench(
        "recommended preset (fix=true) on full invalid typed fixture corpus",
        async () => {
            expect.hasAssertions();

            const lintResults = await lintScenario({
                filePatterns: benchmarkFileGlobs.typedInvalidFixtures,
                fix: true,
                rules: benchmarkRuleSets.recommended,
            });

            assertMeaningfulBenchmarkSignal(
                "recommended preset (fix=true) on full invalid typed fixture corpus",
                lintResults
            );
        },
        expensiveBenchmarkOptions
    );
});
