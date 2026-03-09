# object-format

Enforce object literal line format based on property count.

## Rule Details

This rule enforces the documented pattern for `object-format`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/object-format": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
