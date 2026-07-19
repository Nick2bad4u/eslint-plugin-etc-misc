# prefer-object-has-own

Prefer `Object.hasOwn(...)` over `Object.prototype.hasOwnProperty.call(...)`.

## Targeted pattern scope

This rule targets property-ownership checks using `hasOwnProperty.call`.

## What this rule reports

This rule reports legacy `Object.prototype.hasOwnProperty.call(...)` patterns.

## Why this rule exists

`Object.hasOwn(...)` is shorter, clearer, and less error-prone.

## ❌ Incorrect

```ts
Object.prototype.hasOwnProperty.call(record, "id");
```

## ✅ Correct

```ts
Object.hasOwn(record, "id");
```

## Behavior and migration notes

This rule forwards options and behavior to ESLint core
`prefer-object-has-own`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`prefer-object-has-own` (ESLint core)](https://eslint.org/docs/latest/rules/prefer-object-has-own)

## Additional examples

```ts
Object.prototype.hasOwnProperty.call(config, "port");
// ❌ reported

Object.hasOwn(config, "port");
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/prefer-object-has-own": "error",
  },
 },
];
```

## When not to use it

Disable this rule if you must support runtimes without `Object.hasOwn(...)` and
cannot polyfill it.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R063

## Further reading

- [ESLint: `prefer-object-has-own`](https://eslint.org/docs/latest/rules/prefer-object-has-own)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
