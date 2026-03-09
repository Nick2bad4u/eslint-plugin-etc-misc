# sort-class-members

Enforce alphabetical sorting of class members.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`sort-class-members/sort-class-members`](https://www.npmjs.com/package/eslint-plugin-sort-class-members) or [Perfectionist sorting rules](https://perfectionist.dev/)

## Rule Details

This rule enforces the documented pattern for `sort-class-members`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/sort-class-members": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
