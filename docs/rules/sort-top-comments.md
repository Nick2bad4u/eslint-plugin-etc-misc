# sort-top-comments

Enforce alphabetical sorting of top-of-file comments.

## Rule Details

This rule enforces the documented pattern for `sort-top-comments`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/sort-top-comments": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.
