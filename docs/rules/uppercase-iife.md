# uppercase-iife

Disallow unreadable immediately invoked arrow function expressions.

## Targeted pattern scope

This rule targets immediately invoked arrow function expressions (IIFEs).

## What this rule reports

This rule reports IIFEs whose arrow function body is an unnecessary
parenthesized expression.

## Why this rule exists

Extra parentheses in IIFE arrow bodies reduce readability and add noise.

## ❌ Incorrect

```ts
(() => (doWork()))();
```

## ✅ Correct

```ts
(() => doWork())();
```

## Behavior and migration notes

This rule forwards options and behavior to `unicorn/no-unreadable-iife`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`unicorn/no-unreadable-iife`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-iife.md)

## Additional examples

```ts
// Add project-specific examples here when edge cases matter.
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/uppercase-iife": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your team deliberately keeps this parenthesized IIFE style
for historical consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R078

## Further reading

- [unicorn: `no-unreadable-iife`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-iife.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
