# typescript/no-restricted-syntax

Disallow syntax using selector rules with optional type-group filters.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-restricted-syntax`](https://typescript-eslint.io/rules/no-restricted-syntax)

## Rule Details

This rule enforces the documented pattern for `typescript/no-restricted-syntax`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/no-restricted-syntax": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
