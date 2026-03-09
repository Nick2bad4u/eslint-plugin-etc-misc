# template-literal-format

Enforce newline-boundary formatting for multiline template literals.

## Rule Details

This rule enforces the documented pattern for `template-literal-format`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/template-literal-format": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
