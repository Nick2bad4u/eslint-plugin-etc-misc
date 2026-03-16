# typescript/require-readonly-set-parameter-type

Require `ReadonlySet` for function and method parameter type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Set<...>` parameter type annotations,
including top-level union/intersection members such as `Set<T> | null`.

It checks function declarations, function expressions, arrow functions,
call/method signatures, and constructor/function type nodes (including
constructor parameter properties).

## What this rule reports

This rule reports parameter annotations that use mutable `Set<...>`.

## Why this rule exists

Parameter types define API input contracts. Using `ReadonlySet` for parameters
communicates non-mutating expectations and helps avoid accidental argument
mutation.

## ❌ Incorrect

```ts
function loadTags(tags: Set<string>): void {}

const resolver = (tags: Set<string> | null) => tags;

class Registry {
 constructor(private readonly tags: Set<string>) {}
}
```

## ✅ Correct

```ts
function loadTags(tags: ReadonlySet<string>): void {}

const resolver = (tags: ReadonlySet<string> | null) => tags;

class Registry {
 constructor(private readonly tags: ReadonlySet<string>) {}
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Set<T>` is converted to `ReadonlySet<T>`.
- The rule intentionally checks only top-level parameter types (and top-level
  union/intersection members), not nested object-property types.

## Additional examples

```ts
function configure(options: { tags: Set<string> }): void {}
// ✅ valid (nested property type is out of scope)

function configure(tags?: ReadonlySet<string>): void {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/require-readonly-set-parameter-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally mutates set inputs or if you
already enforce a broader readonly parameter policy via type-aware linting.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R126

## Further reading

- [TypeScript: ReadonlySet<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
