# typescript/prefer-readonly-array-parameter

Require readonly array-like types for function and method parameters.

## Targeted pattern scope

This rule targets top-level array-like parameter type annotations, including:

- `T[]`
- tuple types (`[A, B]`)
- `Array<T>`
- union/intersection members such as `T[] | null`

It also checks constructor parameter properties.

## What this rule reports

This rule reports parameter annotations that use mutable array-like types.

## Why this rule exists

Parameters are API boundaries. Marking array-like parameter types as readonly
reduces accidental mutation and clarifies intent for callers and implementers.

## ❌ Incorrect

```ts
function parse(values: string[]) {}

const fn = (pair: [string, number]) => pair[0];

class Store {
    constructor(private keys: Array<string>) {}
}
```

## ✅ Correct

```ts
function parse(values: readonly string[]) {}

const fn = (pair: readonly [string, number]) => pair[0];

class Store {
    constructor(private keys: ReadonlyArray<string>) {}
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Array<T>` is converted to `ReadonlyArray<T>`.
- `T[]` and tuple types are converted to `readonly ...` forms.

The rule intentionally checks only top-level parameter types (and top-level
union/intersection members), not nested object-property types.

## Additional examples

```ts
function f(values: string[] | null): void {}
// ❌ reported

function f(values: readonly string[] | null): void {}
// ✅ valid

function f(config: { values: string[] }): void {}
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-readonly-array-parameter": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally mutates array-like parameter
values and you do not want readonly parameter contracts.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R099

## Further reading

- [TypeScript: ReadonlyArray<T>](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)
- [TypeScript: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
