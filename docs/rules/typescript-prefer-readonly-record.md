# typescript/prefer-readonly-record

Require `Readonly<Record<K, V>>` instead of mutable `Record<K, V>`.

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

type Nested = Promise<Readonly<Record<string, Readonly<Record<string, number>>>>>;
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

> **Rule catalog ID:** R104

## Further reading

- [TypeScript Utility Types: Record](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [TypeScript Utility Types: Readonly](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
