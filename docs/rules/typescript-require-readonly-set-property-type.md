# typescript/require-readonly-set-property-type

Require `ReadonlySet` for top-level property type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Set<T>` property type annotations,
including top-level union/intersection members such as
`Set<string> | null`.

It checks property signatures in interfaces and type literals.

## What this rule reports

This rule reports property annotations that use mutable `Set<...>`.

## Why this rule exists

Property signatures define object contracts consumed across your codebase.
Using `ReadonlySet` for these property types communicates immutability intent
and helps avoid accidental mutation through shared set-like data.

## ❌ Incorrect

```ts
interface Config {
 values: Set<string>;
}

type ApiConfig = {
 values: Set<string> | null;
};
```

## ✅ Correct

```ts
interface Config {
 values: ReadonlySet<string>;
}

type ApiConfig = {
 values: ReadonlySet<string> | null;
};
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Set<T>` is converted to `ReadonlySet<T>`.
- The rule intentionally checks only top-level property type annotations (and
  top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
interface Config {
 values: Promise<Set<string>>;
}
// ✅ valid (nested generic type is out of scope)

type Settings = {
 values: { nested: Set<string> };
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
   "etc-misc/typescript/require-readonly-set-property-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally models property sets as
mutable or if broader readonly policies already enforce your preferred
constraints.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R127

## Further reading

- [TypeScript: ReadonlySet<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
