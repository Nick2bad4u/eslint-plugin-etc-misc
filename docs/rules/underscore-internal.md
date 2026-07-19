# underscore-internal

Disallow `@internal` APIs that are not underscore-prefixed.

## Targeted pattern scope

This rule checks identifier names for declarations/signatures such as:

- class/function/type/interface/enum declarations,
- variable declarators,
- class methods/properties,
- interface method/property signatures,
- enum members.

It reports names that do not start with `_` when `@internal` is present in a
leading comment for the node (or its export declaration wrapper).

## What this rule reports

This rule reports declarations tagged with `@internal` when their names do not begin with `_`.

The convention makes internal-only APIs visually obvious and helps prevent accidental public use.

## Why this rule exists

It enforces a consistent signal that internal-only APIs are not part of the
public contract.

## ❌ Incorrect

```ts
/** @internal */
export function parseSecret(): void {}
```

```ts
export interface Thing {
 /** @internal */
 compute(): number;
}
```

## ✅ Correct

```ts
/** @internal */
export function _parseSecret(): void {}
```

```ts
export interface Thing {
 /** @internal */
 _compute(): number;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is typically renaming internal declarations to use an underscore
prefix.

### Options

This rule has no options.

## Additional examples

```ts
/** @internal */
export const token = "x";
// ❌ reported

/** @internal */
export const _token = "x";
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/underscore-internal": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project uses a different naming convention for internal APIs.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R079

## Further reading

- [TSDoc `@internal` tag](https://tsdoc.org/pages/tags/internal/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
