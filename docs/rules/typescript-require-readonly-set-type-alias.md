# typescript/require-readonly-set-type-alias

Require readonly set types in type alias annotations.

## Targeted pattern scope

This rule targets top-level `Set<T>` type alias annotations, including
union/intersection members such as `Set<T> | null`.

It checks only the type annotation attached to `type` aliases.

## What this rule reports

This rule reports type alias annotations that use mutable `Set<...>`.

## Why this rule exists

Type aliases often define reusable API contracts. Using `ReadonlySet` in alias
annotations communicates immutability expectations to all downstream uses.

## ❌ Incorrect

```ts
type Tags = Set<string>;

type MaybeTags = Set<string> | null;

type Combined = Set<string> & { readonly kind: "ok" };
```

## ✅ Correct

```ts
type Tags = ReadonlySet<string>;

type MaybeTags = ReadonlySet<string> | null;

type Combined = ReadonlySet<string> & { readonly kind: "ok" };
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

- `Set<T>` is converted to `ReadonlySet<T>`.
- The rule intentionally checks only top-level type alias annotations (and
  top-level union/intersection members), not nested object-property types.

## Additional examples

```ts
type Resolver = Promise<Set<string>>;
// ✅ valid (nested generic type is out of scope)

type Config = { tags: Set<string> };
// ✅ valid (nested property type is out of scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-readonly-set-type-alias": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses mutable set aliases or if
you already enforce immutability through a broader rule strategy.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R118

## Further reading

- [TypeScript: ReadonlySet<T>](https://www.typescriptlang.org/docs/handbook/utility-types.html)
