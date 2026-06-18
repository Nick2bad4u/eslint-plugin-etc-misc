import * as fc from "fast-check";

// eslint-disable-next-line n/no-process-env -- Environment variable used to configure the number of runs for fast-check tests.
const configuredNumRunsRaw = process.env["FAST_CHECK_NUM_RUNS"];
const configuredNumRuns =
    configuredNumRunsRaw === undefined
        ? NaN
        : Number.parseInt(configuredNumRunsRaw, 10);

if (Number.isFinite(configuredNumRuns) && configuredNumRuns > 0) {
    fc.configureGlobal({
        numRuns: configuredNumRuns,
    });
}
