# typescript/require-readonly-record-type-alias

Require readonly record types in type alias annotations.

## Targeted pattern scope

This rule targets top-level `Record<K, V>` type alias annotations, including
union/intersection members such as `Record<K, V> | null`.

It checks only the type annotation attached to `type` aliases.

## What this rule reports

This rule reports type alias annotations that use mutable `Record<...>`.

## Why this rule exists

Type aliases often define reusable API contracts. Using `Readonly<Record<...>>`
in alias annotations communicates immutability expectations to all downstream
uses.

## ❌ Incorrect

```ts
type Lookup = Record<string, number>;

type MaybeLookup = Record<string, number> | null;

type Combined = Record<string, number> & { readonly kind: "ok" };
```

## ✅ Correct

```ts
type Lookup = Readonly<Record<string, number>>;

type MaybeLookup = Readonly<Record<string, number>> | null;

type Combined = Readonly<Record<string, number>> & { readonly kind: "ok" };
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Record<K, V>` is converted to `Readonly<Record<K, V>>`.
- The rule intentionally checks only top-level type alias annotations (and
  top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
type Resolver = Promise<Record<string, number>>;
// ✅ valid (nested generic type is out of scope)

type Config = { lookup: Record<string, number> };
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-readonly-record-type-alias": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses mutable record aliases or
if you already enforce immutability through a broader rule strategy.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R122

## Further reading

- [TypeScript Utility Types: `Readonly<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
