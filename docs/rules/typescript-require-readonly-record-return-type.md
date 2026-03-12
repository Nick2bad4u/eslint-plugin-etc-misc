# typescript/require-readonly-record-return-type

Require `Readonly<Record<...>>` for function and method return type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Record<K, V>` return type annotations,
including top-level union/intersection members such as
`Record<string, string> | null`.

It checks function declarations, function expressions, arrow functions with
return annotations, call/method signatures, and constructor/function type nodes.

## What this rule reports

This rule reports return type annotations that use mutable `Record<...>`.

## Why this rule exists

Return types define API contracts. Returning `Readonly<Record<...>>`
communicates non-mutating intent to callers and reduces accidental mutation of
shared dictionary-like objects.

## ❌ Incorrect

```ts
function buildLookup(): Record<string, number> {
    return {};
}

type Resolver = () => Record<string, string> | null;

interface API {
    run(): Record<string, string>;
}
```

## ✅ Correct

```ts
function buildLookup(): Readonly<Record<string, number>> {
    return {};
}

type Resolver = () => Readonly<Record<string, string>> | null;

interface API {
    run(): Readonly<Record<string, string>>;
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Record<K, V>` is converted to `Readonly<Record<K, V>>`.
- The rule intentionally checks only top-level return types (and top-level
  union/intersection members), not nested object-property types.

## Additional examples

```ts
function buildConfig(): Promise<Record<string, string>> {
    return Promise.resolve({});
}
// ✅ valid (nested generic type is out of scope)

function buildState(): { values: Record<string, string> } {
    return { values: {} };
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
            "etc-misc/typescript/require-readonly-record-return-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally exposes mutable `Record`
return types or if you already enforce broader readonly type policy at the same
scope.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R121

## Further reading

- [TypeScript Utility Types: `Readonly<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
