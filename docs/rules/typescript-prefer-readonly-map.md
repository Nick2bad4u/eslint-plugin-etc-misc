# typescript/prefer-readonly-map

Require `ReadonlyMap` instead of `Map` in type positions.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`typescript/require-readonly-map-property-type`](./typescript-require-readonly-map-property-type.md), [`typescript/require-readonly-map-return-type`](./typescript-require-readonly-map-return-type.md), [`typescript/require-readonly-map-type-alias`](./typescript-require-readonly-map-type-alias.md), and [`@typescript-eslint/prefer-readonly-parameter-types`](https://typescript-eslint.io/rules/prefer-readonly-parameter-types/)

Use only the scoped local rules for positions your project intends to govern.
The typescript-eslint replacement performs deeper, type-aware parameter
analysis. Do not enable this broad rule alongside those replacements because
their diagnostics overlap.

## Targeted pattern scope

This rule targets `Map` identifier references in TypeScript type references.

## What this rule reports

This rule reports `Map` type references in TypeScript annotations.

## Why this rule exists

`ReadonlyMap` better communicates read-only intent in APIs that should not
mutate incoming maps.

## ❌ Incorrect

```ts
function f(values: Map<string, string>) {}
```

## ✅ Correct

```ts
function f(values: ReadonlyMap<string, string>) {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is usually replacing `Map<K, V>` with `ReadonlyMap<K, V>` in type
positions.

### Options

This rule has no options.

## Additional examples

```ts
type Cache = Map<string, number>;
// ❌ reported

type CacheView = ReadonlyMap<string, number>;
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/prefer-readonly-map": "error",
  },
 },
];
```

## When not to use it

Disable this rule if mutable maps are expected throughout your codebase.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R137

## Further reading

- [TypeScript lib: ReadonlyMap](https://github.com/microsoft/TypeScript/blob/main/src/lib/es2015.collection.d.ts)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
