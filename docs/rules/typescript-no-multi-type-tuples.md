# typescript/no-multi-type-tuples

Disallow union element types directly inside tuple elements.

## Targeted pattern scope

This rule targets union types used directly as tuple element types.

Example target shape: `TSTupleType > TSUnionType`.

## What this rule reports

This rule reports tuple elements written as unions (for example, `[A | B]`).

## Why this rule exists

Extracting tuple union elements into named aliases can improve readability and
reuse.

## ❌ Incorrect

```ts
type T = [string | number];
```

## ✅ Correct

```ts
type Value = string | number;
type T = [Value];
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is usually introducing a named alias for the union and using that
alias in the tuple.

### Options

This rule has no options.

## Additional examples

```ts
type Pair = [string | number, boolean];
// ❌ reported on `string | number`

type Value = string | number;
type PairFixed = [Value, boolean];
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-multi-type-tuples": "error",
  },
 },
];
```

## When not to use it

Disable this rule if inline union tuple element types are preferred in your project.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R117

## Further reading

- [TypeScript: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
