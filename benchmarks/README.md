# ESLint benchmark suite

This directory contains performance benchmarks for `eslint-plugin-etc-misc`.

The benchmark runner executes representative lint workloads and captures ESLint
stats output so performance regressions are easy to compare over time.

## Run benchmarks

```bash
npm run bench:eslint:stats
```

Optional tuning:

```bash
node benchmarks/run-eslint-stats.mjs --iterations=5 --warmup=2
```

Compare against a previous run:

```bash
node benchmarks/run-eslint-stats.mjs --compare=coverage/benchmarks/eslint-stats.json
```

## Output

Results are written to:

- `coverage/benchmarks/eslint-stats.json`

Use the generated JSON for CI trend tracking or local before/after comparisons.
