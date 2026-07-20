# typescript/require-readonly-map-property-type

Require `ReadonlyMap` for top-level property type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Map<K, V>` property type annotations,
including top-level union/intersection members such as
`Map<string, number> | null`.

It checks property signatures in interfaces and type literals.

## What this rule reports

This rule reports property annotations that use mutable `Map<...>`.

## Why this rule exists

Property signatures define object contracts consumed across your codebase.
Using `ReadonlyMap` for these property types communicates immutability intent
and helps avoid accidental mutation through shared map-like data.

## ❌ Incorrect

```ts
interface Config {
 lookup: Map<string, number>;
}

type ApiConfig = {
 lookup: Map<string, number> | null;
};
```

## ✅ Correct

```ts
interface Config {
 lookup: ReadonlyMap<string, number>;
}

type ApiConfig = {
 lookup: ReadonlyMap<string, number> | null;
};
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Map<K, V>` is converted to `ReadonlyMap<K, V>`.
- The rule intentionally checks only top-level property type annotations (and
  top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
interface Config {
 lookup: Promise<Map<string, number>>;
}
// ✅ valid (nested generic type is out of scope)

type Settings = {
 lookup: { nested: Map<string, number> };
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
   "etc-misc/typescript/require-readonly-map-property-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally models property maps as
mutable or if broader readonly policies already enforce your preferred
constraints.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R146

## Further reading

- [TypeScript: ReadonlyMap\<K, V>](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
