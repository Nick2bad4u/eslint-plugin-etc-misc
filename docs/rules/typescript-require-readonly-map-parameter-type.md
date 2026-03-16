# typescript/require-readonly-map-parameter-type

Require `ReadonlyMap` for function and method parameter type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Map<...>` parameter type annotations,
including top-level union/intersection members such as `Map<K, V> | null`.

It checks function declarations, function expressions, arrow functions,
call/method signatures, and constructor/function type nodes (including
constructor parameter properties).

## What this rule reports

This rule reports parameter annotations that use mutable `Map<...>`.

## Why this rule exists

Parameter types define API input contracts. Using `ReadonlyMap` for parameters
communicates non-mutating expectations and helps avoid accidental argument
mutation.

## ❌ Incorrect

```ts
function loadIndex(index: Map<string, number>): void {}

const resolver = (index: Map<string, number> | null) => index;

class Registry {
 constructor(private readonly table: Map<string, string>) {}
}
```

## ✅ Correct

```ts
function loadIndex(index: ReadonlyMap<string, number>): void {}

const resolver = (index: ReadonlyMap<string, number> | null) => index;

class Registry {
 constructor(private readonly table: ReadonlyMap<string, string>) {}
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Map<K, V>` is converted to `ReadonlyMap<K, V>`.
- The rule intentionally checks only top-level parameter types (and top-level
  union/intersection members), not nested object-property types.

## Additional examples

```ts
function configure(options: { index: Map<string, number> }): void {}
// ✅ valid (nested property type is out of scope)

function configure(index?: ReadonlyMap<string, number>): void {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/require-readonly-map-parameter-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally mutates map inputs or if you
already enforce a broader readonly parameter policy via type-aware linting.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R118

## Further reading

- [TypeScript: ReadonlyMap\<K, V>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
