# no-misused-generics

Disallow generic type parameters that cannot be inferred or that do not enforce a meaningful type relationship.

## Targeted pattern scope

This rule checks TypeScript signature declarations that declare generic type parameters, including:

- function declarations and expressions,
- arrow functions,
- methods,
- call/construct signatures,
- function and constructor type signatures.

## What this rule reports

This rule reports type parameters when either of the following is true:

- the type parameter cannot be inferred from any function parameter (`cannotInfer`), or
- the type parameter is inferable but does not enforce a meaningful relationship and can be replaced by `unknown` (or its explicit constraint) (`canReplace`).

## Why this rule exists

Type parameters should encode real relationships between values and types. If a type parameter cannot be inferred, callers must always provide it manually. If it does not constrain behavior, it often adds complexity without extra safety.

## ❌ Incorrect

```ts
declare function get<T>(): T;
```

```ts
declare function take<T>(value: T): void;
```

## ✅ Correct

```ts
declare function identity<T>(value: T): T;
```

```ts
declare function compare<T>(left: T, right: T): boolean;
```

```ts
declare function compare<T, U extends T>(left: T, right: U): boolean;
```

## Behavior and migration notes

This rule has no options.

When this rule reports `canReplace`, replacing the type parameter with `unknown` (or with the explicit constraint) usually preserves intent while reducing generic noise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-misused-generics": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally keeps explicit, documentation-only type parameters even when they are not inferable or enforceable.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R031

## Further reading

- [The Golden Rule of Generics](https://effectivetypescript.com/2020/08/12/generics-golden-rule/)
- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
