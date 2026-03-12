# typescript/require-readonly-record-parameter-type

Require `Readonly<Record<...>>` for function and method parameter type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Record<K, V>` parameter type annotations,
including top-level union/intersection members such as
`Record<string, string> | null`.

It checks function declarations, function expressions, arrow functions,
call/method signatures, and constructor/function type nodes (including
constructor parameter properties).

## What this rule reports

This rule reports parameter annotations that use mutable `Record<...>`.

## Why this rule exists

Parameter types define API input contracts. Using `Readonly<Record<...>>` for
parameters communicates non-mutating expectations and helps avoid accidental
argument mutation.

## ❌ Incorrect

```ts
function loadLookup(lookup: Record<string, string>): void {}

const resolver = (lookup: Record<string, string> | null) => lookup;

class Registry {
    constructor(private readonly lookup: Record<string, string>) {}
}
```

## ✅ Correct

```ts
function loadLookup(lookup: Readonly<Record<string, string>>): void {}

const resolver = (lookup: Readonly<Record<string, string>> | null) => lookup;

class Registry {
    constructor(private readonly lookup: Readonly<Record<string, string>>) {}
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Record<K, V>` is converted to `Readonly<Record<K, V>>`.
- The rule intentionally checks only top-level parameter types (and top-level
  union/intersection members), not nested object-property types.

## Additional examples

```ts
function configure(options: { lookup: Record<string, string> }): void {}
// ✅ valid (nested property type is out of scope)

function configure(lookup?: Readonly<Record<string, string>>): void {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-readonly-record-parameter-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally mutates record inputs or if
you already enforce a broader readonly parameter policy via type-aware linting.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R112

## Further reading

- [TypeScript Utility Types: `Readonly<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
