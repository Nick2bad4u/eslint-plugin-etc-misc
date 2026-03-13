# typescript/prefer-array-type-alias

Prefer reusable alias names for array and tuple type aliases.

## Targeted pattern scope

This rule targets type alias identifiers when the alias annotation is:

- `TSArrayType` (`T[]`), or
- `TSTupleType` (`[A, B]`).

The alias name must match a PascalCase pattern ending in `Array` or `s`.

## What this rule reports

This rule reports array/tuple type aliases that do not follow preferred reusable alias naming.

## Why this rule exists

Collection-shaped aliases become easier to recognize and search when naming is
consistent.

## ❌ Incorrect

```ts
type Item = string[];
```

## ✅ Correct

```ts
type Items = string[];
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is typically renaming the alias and updating references.

### Options

This rule has no options.

## Additional examples

```ts
type Pair = [string, string];
// ❌ reported

type Pairs = [string, string];
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-array-type-alias": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project does not standardize alias naming for array and tuple types.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R103

## Further reading

- [TypeScript: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
