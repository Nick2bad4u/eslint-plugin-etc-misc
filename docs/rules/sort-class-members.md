# sort-class-members

Enforce alphabetical sorting of class members.

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
