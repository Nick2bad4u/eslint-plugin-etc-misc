# typescript/require-readonly-set-return-type

Require `ReadonlySet` for function and method return type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Set<...>` return type annotations,
including top-level union/intersection members such as `Set<T> | null`.

It checks function declarations, function expressions, arrow functions with
return annotations, call/method signatures, and constructor/function type nodes.

## What this rule reports

This rule reports return type annotations that use mutable `Set<...>`.

## Why this rule exists

Return types define API contracts. Returning `ReadonlySet` communicates
non-mutating intent to callers and reduces accidental mutation of shared sets.

## ❌ Incorrect

```ts
function buildTags(): Set<string> {
    return new Set();
}

type Resolver = () => Set<string> | null;

interface API {
    run(): Set<string>;
}
```

## ✅ Correct

```ts
function buildTags(): ReadonlySet<string> {
    return new Set();
}

type Resolver = () => ReadonlySet<string> | null;

interface API {
    run(): ReadonlySet<string>;
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Set<T>` is converted to `ReadonlySet<T>`.
- The rule intentionally checks only top-level return types (and top-level
  union/intersection members), not nested object-property types.

## Additional examples

```ts
function buildConfig(): Promise<Set<string>> {
    return Promise.resolve(new Set());
}
// ✅ valid (nested generic type is out of scope)

function buildState(): { values: Set<string> } {
    return { values: new Set() };
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
            "etc-misc/typescript/require-readonly-set-return-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally exposes mutable `Set` return
types or if you already enforce broader readonly type policy at the same scope.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R124

## Further reading

- [TypeScript: ReadonlySet<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
