# typescript/prefer-readonly-array

Require readonly array and tuple type annotations.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`typescript/require-readonly-array-property-type`](./typescript-require-readonly-array-property-type.md), [`typescript/require-readonly-array-return-type`](./typescript-require-readonly-array-return-type.md), [`typescript/require-readonly-array-type-alias`](./typescript-require-readonly-array-type-alias.md), and [`@typescript-eslint/prefer-readonly-parameter-types`](https://typescript-eslint.io/rules/prefer-readonly-parameter-types/)

Use only the scoped local rules for positions your project intends to govern.
The typescript-eslint replacement performs deeper, type-aware parameter
analysis. Do not enable this broad rule alongside those replacements because
their diagnostics overlap.

## Targeted pattern scope

This rule targets mutable array-like annotations, including:

- `T[]` and tuple annotations not wrapped in `readonly ...`, and
- `Array<T>` references.

## What this rule reports

This rule reports writable array and tuple type annotations.

## Why this rule exists

Readonly array/tuple annotations communicate immutability at API boundaries and
reduce accidental mutation.

## ❌ Incorrect

```ts
function f(values: string[]) {}
```

## ✅ Correct

```ts
function f(values: readonly string[]) {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Common migration targets are `readonly T[]`, `readonly [A, B]`, or
`ReadonlyArray<T>`.

### Options

This rule has no options.

## Additional examples

```ts
function parse(pair: [string, number]): void {}
// ❌ reported

function parseSafe(pair: readonly [string, number]): void {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/prefer-readonly-array": "error",
  },
 },
];
```

## When not to use it

Disable this rule if mutable arrays and tuples are preferred in your API design.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R134

## Further reading

- [TypeScript: ReadonlyArray<T>](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
