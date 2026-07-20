# no-useless-generics

Disallow type parameters that do not improve a declaration's type safety.

> ⚠️ This rule requires type information to run.

## Targeted pattern scope

This rule targets TypeScript signatures that declare generic type parameters.

## What this rule reports

This rule reports generic parameters that do not provide meaningful type
relationships.

## Why this rule exists

Redundant generic parameters add cognitive overhead and can mislead readers into
thinking polymorphism is required when it is not. This rule reports unnecessary
generic type parameters.

## ❌ Incorrect

```ts
function toUpper<T>(value: string): string {
 return value.toUpperCase();
}
```

## ✅ Correct

```ts
function identity<T>(value: T): T {
 return value;
}
```

## Behavior and migration notes

This rule forwards options to
`@typescript-eslint/no-unnecessary-type-parameters`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-unnecessary-type-parameters`](https://typescript-eslint.io/rules/no-unnecessary-type-parameters)

## Additional examples

```ts
function parse<T extends string>(input: string): string {
 return input.trim();
}
// ❌ reported: generic does not add a relation

function first<T>(items: readonly T[]): T | undefined {
 return items[0];
}
// ✅ valid: generic ties parameter and return type
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-useless-generics": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your API surface intentionally keeps placeholder type
parameters for generated declarations or staged migrations.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R069

## Further reading

- [typescript-eslint: `no-unnecessary-type-parameters`](https://typescript-eslint.io/rules/no-unnecessary-type-parameters)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
