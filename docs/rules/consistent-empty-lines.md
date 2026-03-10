# consistent-empty-lines

Enforce configured empty-line consistency between selected nodes.

## Targeted pattern scope

This rule operates on the full file text and checks for runs of empty lines.

It allows:

- zero empty lines, or
- exactly one empty line between non-empty lines.

It reports when it finds **two or more consecutive empty lines**.

## What this rule reports

This rule reports files containing consecutive blank-line runs longer than one
line.

An autofix is provided and collapses each run to a single blank line.

## Why this rule exists

Extra vertical whitespace often accumulates during edits and merge conflict
resolution. Enforcing a single-blank-line maximum keeps files visually dense and
reduces noisy formatting diffs.

## ❌ Incorrect

```ts
const first = 1;


const second = 2;
```

## ✅ Correct

```ts
const first = 1;

const second = 2;
```

## Behavior and migration notes

This rule is fully autofixable (`fixable: "whitespace"`).

Recommended rollout:

1. Run once with `--fix-dry-run` to estimate churn.
2. Apply autofix in a dedicated formatting PR.
3. Enable as `error` to keep the baseline clean.

### Options

This rule has no options.

## Additional examples

```ts
function run(): void {
    stepOne();

    stepTwo();
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/consistent-empty-lines": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your style guide intentionally allows multiple blank lines
for sectioning or if another formatter already controls vertical spacing exactly
as desired.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R004

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
