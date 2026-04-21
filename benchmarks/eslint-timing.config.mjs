import {
    benchmarkRuleSets,
    createBenchmarkFlatConfig,
} from "./eslint-benchmark-config.mjs";

/**
 * Benchmark-oriented ESLint flat config for CLI TIMING/--stats runs.
 */
/** @type {readonly import("eslint").Linter.Config[]} */
const benchmarkTimingConfig = createBenchmarkFlatConfig({
    rules: benchmarkRuleSets.recommended,
});

export default benchmarkTimingConfig;
