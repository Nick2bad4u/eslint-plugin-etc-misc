# typescript/require-readonly-map-return-type

Require `ReadonlyMap` for function and method return type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Map<...>` return type annotations,
including top-level union/intersection members such as `Map<K, V> | null`.

It checks function declarations, function expressions, arrow functions with
return annotations, call/method signatures, and constructor/function type nodes.

## What this rule reports

This rule reports return type annotations that use mutable `Map<...>`.

## Why this rule exists

Return types define API contracts. Returning `ReadonlyMap` communicates
non-mutating intent to callers and reduces accidental mutation of shared maps.

## ❌ Incorrect

```ts
function buildLookup(): Map<string, number> {
    return new Map();
}

type Resolver = () => Map<string, string> | null;

interface API {
    run(): Map<string, string>;
}
```

## ✅ Correct

```ts
function buildLookup(): ReadonlyMap<string, number> {
    return new Map();
}

type Resolver = () => ReadonlyMap<string, string> | null;

interface API {
    run(): ReadonlyMap<string, string>;
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Map<K, V>` is converted to `ReadonlyMap<K, V>`.
- The rule intentionally checks only top-level return types (and top-level
  union/intersection members), not nested object-property types.

## Additional examples

```ts
function buildConfig(): Promise<Map<string, string>> {
    return Promise.resolve(new Map());
}
// ✅ valid (nested generic type is out of scope)

function buildState(): { values: Map<string, string> } {
    return { values: new Map() };
}
// ✅ valid (nested object-property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-readonly-map-return-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally exposes mutable `Map` return
types or if you already enforce broader readonly type policy at the same scope.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R120

## Further reading

- [TypeScript: ReadonlyMap<K, V>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
