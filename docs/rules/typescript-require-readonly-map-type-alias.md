# typescript/require-readonly-map-type-alias

Require readonly map types in type alias annotations.

## Targeted pattern scope

This rule targets top-level `Map<K, V>` type alias annotations, including
union/intersection members such as `Map<K, V> | null`.

It checks only the type annotation attached to `type` aliases.

## What this rule reports

This rule reports type alias annotations that use mutable `Map<...>`.

## Why this rule exists

Type aliases often define reusable API contracts. Using `ReadonlyMap` in alias
annotations communicates immutability expectations to all downstream uses.

## ❌ Incorrect

```ts
type Lookup = Map<string, number>;

type MaybeLookup = Map<string, number> | null;

type Combined = Map<string, number> & { readonly kind: "ok" };
```

## ✅ Correct

```ts
type Lookup = ReadonlyMap<string, number>;

type MaybeLookup = ReadonlyMap<string, number> | null;

type Combined = ReadonlyMap<string, number> & { readonly kind: "ok" };
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Map<K, V>` is converted to `ReadonlyMap<K, V>`.
- The rule intentionally checks only top-level type alias annotations (and
  top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
type Resolver = Promise<Map<string, number>>;
// ✅ valid (nested generic type is out of scope)

type Config = { lookup: Map<string, number> };
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/require-readonly-map-type-alias": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses mutable map aliases or if
you already enforce immutability through a broader rule strategy.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R148

## Further reading

- [TypeScript: ReadonlyMap\<K, V>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
