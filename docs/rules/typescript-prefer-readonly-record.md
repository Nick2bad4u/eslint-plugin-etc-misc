# typescript/prefer-readonly-record

Require `Readonly<Record<K, V>>` instead of mutable `Record<K, V>`.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`typescript/require-readonly-record-property-type`](./typescript-require-readonly-record-property-type.md), [`typescript/require-readonly-record-return-type`](./typescript-require-readonly-record-return-type.md), [`typescript/require-readonly-record-type-alias`](./typescript-require-readonly-record-type-alias.md), and [`@typescript-eslint/prefer-readonly-parameter-types`](https://typescript-eslint.io/rules/prefer-readonly-parameter-types/)

Use only the scoped local rules for positions your project intends to govern.
The typescript-eslint replacement performs deeper, type-aware parameter
analysis. Do not enable this broad rule alongside those replacements because
their diagnostics overlap.

## Targeted pattern scope

This rule targets `Record` type references in TypeScript type positions.

## What this rule reports

This rule reports `Record<...>` references that are not already wrapped by
`Readonly<...>`.

## Why this rule exists

`Record<K, V>` is writable by default. Wrapping it with `Readonly<...>` makes
immutability explicit in API and model types.

## ❌ Incorrect

```ts
type Store = Record<string, number>;

type Nested = Promise<Record<string, Record<string, number>>>;
```

## ✅ Correct

```ts
type Store = Readonly<Record<string, number>>;

type Nested = Promise<
 Readonly<Record<string, Readonly<Record<string, number>>>>
>;
```

## Behavior and migration notes

This rule is autofixable. The fixer wraps each reported `Record<...>` with
`Readonly<...>`.

## Additional examples

```ts
type Flags = Record<string, boolean>;
// ❌ reported

type FlagsView = Readonly<Record<string, boolean>>;
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/prefer-readonly-record": "error",
  },
 },
];
```

## When not to use it

Disable this rule if mutable `Record` types are a deliberate project
convention.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R139

## Further reading

- [TypeScript Utility Types: Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [TypeScript Utility Types: Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
