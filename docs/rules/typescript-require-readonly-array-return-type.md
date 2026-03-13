# typescript/require-readonly-array-return-type

Require readonly array-like types for function and method return annotations.

## Targeted pattern scope

This rule targets top-level array-like return type annotations, including:

- `T[]`
- tuple types (`[A, B]`)
- `Array<T>`
- union/intersection members such as `T[] | null`

It checks function declarations, function expressions, arrow functions with return
annotations, call/method signatures, and constructor/function type nodes.

## What this rule reports

This rule reports return type annotations that use mutable array-like types.

## Why this rule exists

Return types define API contracts. Returning readonly array-like types signals
immutability to consumers and prevents accidental mutation at call sites.

## ❌ Incorrect

```ts
function getNames(): string[] {
    return [];
}

type PairFactory = () => [string, number];

interface Api {
    run(): Array<string>;
}
```

## ✅ Correct

```ts
function getNames(): readonly string[] {
    return [];
}

type PairFactory = () => readonly [string, number];

interface Api {
    run(): ReadonlyArray<string>;
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Array<T>` is converted to `ReadonlyArray<T>`.
- `T[]` and tuple types are converted to `readonly ...` forms.

The rule intentionally checks only top-level return types (and top-level
union/intersection members), not nested object-property types.

## Additional examples

```ts
type Resolver = () => string[] | null;
// ❌ reported

type Resolver = () => readonly string[] | null;
// ✅ valid

function getConfig(): { values: string[] } {
    return { values: [] };
}
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-readonly-array-return-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally returns mutable arrays and you
prefer not to expose readonly return contracts.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R116

## Further reading

- [TypeScript: ReadonlyArray<T>](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)
- [TypeScript: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
