# typescript/require-readonly-record-property-type

Require `Readonly<Record<...>>` for property type annotations.

## Targeted pattern scope

This rule targets top-level mutable `Record<K, V>` property type annotations,
including top-level union/intersection members such as
`Record<string, number> | null`.

It checks property signatures in interfaces and type literals.

## What this rule reports

This rule reports property annotations that use mutable `Record<...>`.

## Why this rule exists

Property signatures define object contracts consumed across your codebase.
Using `Readonly<Record<...>>` for these property types communicates immutability
intent and helps avoid accidental mutation through shared dictionary-like data.

## ❌ Incorrect

```ts
interface Config {
    lookup: Record<string, number>;
}

type ApiConfig = {
    lookup: Record<string, number> | null;
};
```

## ✅ Correct

```ts
interface Config {
    lookup: Readonly<Record<string, number>>;
}

type ApiConfig = {
    lookup: Readonly<Record<string, number>> | null;
};
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Record<K, V>` is converted to `Readonly<Record<K, V>>`.
- The rule intentionally checks only top-level property type annotations (and
  top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
interface Config {
    lookup: Promise<Record<string, number>>;
}
// ✅ valid (nested generic type is out of scope)

type Settings = {
    lookup: { nested: Record<string, number> };
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
            "etc-misc/typescript/require-readonly-record-property-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses mutable record property
types or if you already enforce immutability through broader type-aware rules.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R112

## Further reading

- [TypeScript Utility Types: `Readonly<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
