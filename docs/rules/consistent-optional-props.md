# consistent-optional-props

Disallow redundant undefined unions on optional properties.

## Rule Details

This rule enforces the documented pattern for `consistent-optional-props`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/consistent-optional-props": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
