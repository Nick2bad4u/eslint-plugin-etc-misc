# typescript/prefer-enum

Prefer enums over string literal comparisons and unions.

## Rule Details

This rule enforces the documented pattern for `typescript/prefer-enum`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-enum": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
