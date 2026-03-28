import {
    createTypefestFlatConfig,
    typefestRuleSets,
} from "./eslint-benchmark-config.mjs";

/**
 * Benchmark-oriented ESLint flat config for CLI TIMING/--stats runs.
 */
/** @type {readonly import("eslint").Linter.Config[]} */
const benchmarkTimingConfig = createTypefestFlatConfig({
    rules: typefestRuleSets.recommended,
});

export default benchmarkTimingConfig;
