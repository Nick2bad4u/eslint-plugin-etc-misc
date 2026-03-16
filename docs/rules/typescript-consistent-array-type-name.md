# typescript/consistent-array-type-name

Enforce consistent naming for array-like type aliases.

## Targeted pattern scope

This rule targets `type` aliases whose annotation is array-like:

- `TSArrayType` (`T[]`)
- `TSTupleType` (`[A, B]`)
- `TSTypeReference` to `Array<...>`

It then validates the alias identifier against a naming pattern.

## What this rule reports

This rule reports array-like type aliases whose names do not match:

`^(?:[A-Z][a-z\d]*)+(?:Array|s)$`

In practice, this expects PascalCase names ending in `Array` or `s`.

## Why this rule exists

It enforces predictable naming for collection-like aliases so usage intent is
obvious at call sites.

## ❌ Incorrect

```ts
type Item = string[];
```

## ✅ Correct

```ts
type Items = string[];
type ItemArray = Array<string>;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is typically renaming the type alias and updating references.

### Options

This rule has no options.

## Additional examples

```ts
type User = [id: string, name: string];
// ❌ reported

type Users = [id: string, name: string];
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/consistent-array-type-name": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your team does not enforce array-type alias naming conventions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R082

## Further reading

- [TypeScript: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
