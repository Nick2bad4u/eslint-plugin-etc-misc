# comment-spacing

Enforce consistent blank-line spacing after comments.

## Rule Details

This rule enforces the documented pattern for `comment-spacing`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/comment-spacing": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.

> **Rule catalog ID:** R003

## Further reading

- [ESLint: `spaced-comment`](https://eslint.org/docs/latest/rules/spaced-comment)
