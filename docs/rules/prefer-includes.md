# prefer-includes

Prefer `.includes()` over index-based existence checks.

## Targeted pattern scope

This rule targets array and string existence checks based on index comparison.

## What this rule reports

This rule reports patterns such as `indexOf(...) !== -1` and equivalent
index-based presence checks.

## Why this rule exists

`.includes(...)` is clearer and less error-prone than manual index
comparisons.

## ❌ Incorrect

```ts
const hasValue = [1, 2, 3].indexOf(2) !== -1;
```

## ✅ Correct

```ts
const hasValue = [1, 2, 3].includes(2);
```

## Behavior and migration notes

This rule forwards options and behavior to `unicorn/prefer-includes`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`unicorn/prefer-includes`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md)

## Additional examples

```ts
const hasName = names.indexOf("alice") > -1;
// ❌ reported

const hasName2 = names.includes("alice");
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/prefer-includes": "error",
  },
 },
];
```

## When not to use it

Disable this rule if you target runtimes where `.includes()` is unavailable and
cannot be polyfilled safely.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R060

## Further reading

- [unicorn: `prefer-includes`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
