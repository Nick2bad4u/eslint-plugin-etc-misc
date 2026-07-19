# typescript/require-readonly-array-property-type

Require readonly array-like types for top-level property type annotations.

## Targeted pattern scope

This rule targets top-level mutable array-like property type annotations,
including:

- `T[]`
- tuple types (`[A, B]`)
- `Array<T>`
- top-level union/intersection members such as `Array<string> | null`

It checks property signatures in interfaces and type literals.

## What this rule reports

This rule reports property annotations that use mutable array-like types.

## Why this rule exists

Property signatures define shared object contracts. Using readonly array-like
property types communicates immutability intent and helps prevent accidental
mutation through references that are passed around the codebase.

## ❌ Incorrect

```ts
interface Config {
 values: string[];
}

type ApiConfig = {
 values: Array<string> | null;
};
```

## ✅ Correct

```ts
interface Config {
 values: readonly string[];
}

type ApiConfig = {
 values: ReadonlyArray<string> | null;
};
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Array<T>` is converted to `ReadonlyArray<T>`.
- `T[]` and tuple types are converted to `readonly ...` forms.

The rule intentionally checks only top-level property annotations (and
top-level union/intersection members), not nested object-property types.

This rule has no options.

## Additional examples

```ts
interface Config {
 values: Promise<string[]>;
}
// ✅ valid (nested generic type is out of scope)

type Settings = {
 values: { nested: string[] };
};
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/require-readonly-array-property-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally models property arrays as mutable
or if broader immutability rules already enforce your preferred constraints.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R118

## Further reading

- [TypeScript: ReadonlyArray<T>](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)
- [TypeScript: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
