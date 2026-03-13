# typescript/require-readonly-array-type-alias

Require readonly array-like types in type alias annotations.

## Targeted pattern scope

This rule targets top-level array-like type alias annotations, including:

- `T[]`
- tuple types (`[A, B]`)
- `Array<T>`
- union/intersection members such as `T[] | null`

It checks only the type annotation attached to `type` aliases.

## What this rule reports

This rule reports type alias annotations that use mutable array-like types.

## Why this rule exists

Type aliases often define reusable API contracts. Using readonly array-like types
in aliases helps propagate immutability expectations to all downstream uses.

## ❌ Incorrect

```ts
type Names = string[];

type Pair = [string, number];

type Registry = Array<string>;
```

## ✅ Correct

```ts
type Names = readonly string[];

type Pair = readonly [string, number];

type Registry = ReadonlyArray<string>;
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Array<T>` is converted to `ReadonlyArray<T>`.
- `T[]` and tuple types are converted to `readonly ...` forms.

The rule intentionally checks only top-level type alias annotations (and
top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
type Resolver = string[] | null;
// ❌ reported

type Resolver = readonly string[] | null;
// ✅ valid

type Config = { values: string[] };
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-readonly-array-type-alias": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses mutable array type aliases
or if you already enforce immutability through a broader rule strategy.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R117

## Further reading

- [TypeScript: ReadonlyArray<T>](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)
- [TypeScript: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
