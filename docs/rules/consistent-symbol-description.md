# consistent-symbol-description

Require consistent kebab-case Symbol descriptions.

## Targeted pattern scope

This rule inspects `Symbol("...")` calls where the description argument is a
string literal.

Descriptions must match this kebab-style character set:

- lowercase letters (`a-z`)
- digits (`0-9`)
- hyphen (`-`)
- double underscore separator (`__`)

## What this rule reports

This rule reports `Symbol(...)` descriptions that are not lower-case kebab-case (with optional double-underscore separators).

## Why this rule exists

Consistent symbol descriptions improve debugging output and cross-module symbol
naming hygiene.

## ❌ Incorrect

```ts
const x = Symbol("PascalCase");
const y = Symbol("contains spaces");
```

## ✅ Correct

```ts
const x = Symbol("kebab-case__kebab-case");
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migrate by renaming descriptions to lowercase kebab-style tokens.

### Options

This rule has no options.

## Additional examples

```ts
const id = Symbol("cache-key__v2");
// ✅ valid

const bad = Symbol("Cache_Key");
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/consistent-symbol-description": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally allows other naming styles for Symbol descriptions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R011

## Further reading

- [MDN: `Symbol()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/Symbol)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
