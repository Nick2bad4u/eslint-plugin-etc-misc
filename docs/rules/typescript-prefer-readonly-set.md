# typescript/prefer-readonly-set

Require `ReadonlySet` instead of `Set` in type positions.

## Targeted pattern scope

This rule targets `Set` identifier references in TypeScript type references.

## What this rule reports

This rule reports `Set` type references in TypeScript annotations.

## Why this rule exists

`ReadonlySet` makes immutability expectations explicit for API consumers.

## ❌ Incorrect

```ts
function f(values: Set<string>) {}
```

## ✅ Correct

```ts
function f(values: ReadonlySet<string>) {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is usually replacing `Set<T>` with `ReadonlySet<T>` in type
positions.

### Options

This rule has no options.

## Additional examples

```ts
type AllowedRoles = Set<string>;
// ❌ reported

type AllowedRolesView = ReadonlySet<string>;
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-readonly-set": "error",
        },
    },
];
```

## When not to use it

Disable this rule if mutable sets are expected throughout your codebase.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R111

## Further reading

- [TypeScript lib: ReadonlySet](https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.collection.d.ts)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
