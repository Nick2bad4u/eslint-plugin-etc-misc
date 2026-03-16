# no-underscore-export

Disallow underscore-prefixed named exports.

## Targeted pattern scope

This rule reports underscore-prefixed identifiers exported via named export
declarations.

It targets:

- exported function declarations,
- exported `declare function` declarations,
- exported variable declarator identifiers.

## What this rule reports

This rule reports exported declarations whose identifier starts with `_`.

## Why this rule exists

Underscore prefixes are often used for non-public/internal symbols. This rule
prevents exposing those symbols as part of named exports.

## ❌ Incorrect

```ts
export const _x = 1;
export function _f() {}
```

## ✅ Correct

```ts
export const x = 1;
export function f() {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is usually renaming exported symbols or keeping underscore-prefixed
values unexported.

### Options

This rule has no options.

## Additional examples

```ts
const _internal = 1;
export { _internal };
// ✅ currently not reported by this rule's selector coverage

export const _apiToken = "x";
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-underscore-export": "error",
  },
 },
];
```

## When not to use it

Disable this rule if underscore-prefixed exports are part of your public API conventions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R044

## Further reading

- [MDN: `export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
