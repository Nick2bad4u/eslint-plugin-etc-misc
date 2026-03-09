# export-matching-filename-only

Require filename-matching export to be the only export.

## Rule Details

This rule enforces the documented pattern for `export-matching-filename-only`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/export-matching-filename-only": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
