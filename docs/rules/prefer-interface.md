# prefer-interface

Disallow equivalent type aliases when an interface declaration can be used.

## Targeted pattern scope

This rule inspects `TSTypeAliasDeclaration` nodes whose right-hand side is one of:

- an object type literal,
- a function type,
- an intersection type (when `allowIntersection` is `false` and conversion is safe).

## What this rule reports

This rule reports type aliases that can be rewritten as interfaces without changing semantics, and provides both autofix and suggestion output.

## Why this rule exists

For interface-compatible shapes, interfaces can provide clearer extension patterns and better type-display ergonomics. Standardizing on interfaces for these cases reduces style drift and improves readability.

## ❌ Incorrect

```ts
type Person = {
 name: string;
 age: number;
};
```

```ts
type Comparator<T> = (left: T, right: T) => number;
```

## ✅ Correct

```ts
interface Person {
 name: string;
 age: number;
}
```

```ts
interface Comparator<T> {
 (left: T, right: T): number;
}
```

```ts
type Worker = Person | Robot;
```

## Behavior and migration notes

Lifecycle: Deprecated and frozen since `v1.0.0` and available until `v2.0.0`.
Use instead: [`@typescript-eslint/consistent-type-definitions`](https://typescript-eslint.io/rules/consistent-type-definitions).

### Options

```ts
type Options = [
 {
  allowIntersection?: boolean;
  allowLocal?: boolean;
 }?,
];
```

### Default configuration

```ts
[{}];
```

Effective behavior with defaults:

```ts
{ allowIntersection: true, allowLocal: false }
```

- `allowIntersection: false` enables reporting safe intersection aliases that can become `interface ... extends ...`.
- `allowLocal: true` skips non-exported aliases.

> ⚠️ Intersection conversion uses type information and intentionally bails out on unsafe forms (for example unions in referenced members).

## Additional examples

With `allowIntersection: false`:

```ts
interface Name {
 name: string;
}

interface Age {
 age: number;
}

type User = Name & Age;
```

is converted to:

```ts
interface Name {
 name: string;
}

interface Age {
 age: number;
}

interface User extends Name, Age {}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/prefer-interface": [
    "error",
    {
     allowIntersection: false,
     allowLocal: true,
    },
   ],
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally standardizes on type aliases for interface-compatible shapes.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R058

## Further reading

- [TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook: Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Performance: Preferring Interfaces Over Intersections](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
