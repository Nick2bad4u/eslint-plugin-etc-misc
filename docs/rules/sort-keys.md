# sort-keys

Enforce alphabetical sorting of object keys.

## Rule Details

This rule enforces the documented pattern for `sort-keys`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/sort-keys": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
