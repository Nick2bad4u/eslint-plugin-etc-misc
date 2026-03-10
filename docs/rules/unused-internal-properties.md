# unused-internal-properties

Disallow object properties that are defined but never read.

## Targeted pattern scope

This rule targets object literal properties.

## What this rule reports

This rule reports properties that are declared but never consumed.

## Why this rule exists

Dead properties make object shapes noisy and increase long-term maintenance
cost.

## ❌ Incorrect

```ts
const data = {
    used: 1,
    unused: 2,
};

console.log(data.used);
```

## ✅ Correct

```ts
const data = {
    used: 1,
    alsoUsed: 2,
};

console.log(data.used + data.alsoUsed);
```

## Behavior and migration notes

This rule forwards options and behavior to `unicorn/no-unused-properties`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`unicorn/no-unused-properties`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unused-properties.md)

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
            "etc-misc/unused-internal-properties": "error",
        },
    },
];
```

## When not to use it

Disable this rule when object literals intentionally include reserved fields for
external contracts.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R077

## Further reading

- [unicorn: `no-unused-properties`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unused-properties.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
