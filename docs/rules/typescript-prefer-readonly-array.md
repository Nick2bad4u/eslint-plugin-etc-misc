# typescript/prefer-readonly-array

Require readonly array and tuple type annotations.

## Targeted pattern scope

This rule targets mutable array-like annotations, including:

- `T[]` and tuple annotations not wrapped in `readonly ...`, and
- `Array<T>` references.

## What this rule reports

This rule reports writable array and tuple type annotations.

## Why this rule exists

Readonly array/tuple annotations communicate immutability at API boundaries and
reduce accidental mutation.

## ❌ Incorrect

```ts
function f(values: string[]) {}
```

## ✅ Correct

```ts
function f(values: readonly string[]) {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Common migration targets are `readonly T[]`, `readonly [A, B]`, or
`ReadonlyArray<T>`.

### Options

This rule has no options.

## Additional examples

```ts
function parse(pair: [string, number]): void {}
// ❌ reported

function parseSafe(pair: readonly [string, number]): void {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-readonly-array": "error",
        },
    },
];
```

## When not to use it

Disable this rule if mutable arrays and tuples are preferred in your API design.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R107

## Further reading

- [TypeScript: ReadonlyArray<T>](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
