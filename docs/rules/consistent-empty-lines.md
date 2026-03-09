# consistent-empty-lines

Enforce configured empty-line consistency between selected nodes.

## Rule Details

This rule enforces the documented pattern for `consistent-empty-lines`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/consistent-empty-lines": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
