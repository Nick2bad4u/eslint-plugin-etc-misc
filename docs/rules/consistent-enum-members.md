# consistent-enum-members

Enforce consistent enum member naming/value casing.

## Rule Details

This rule enforces the documented pattern for `consistent-enum-members`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/consistent-enum-members": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.

> **Rule catalog ID:** R005

## Further reading

- [TypeScript handbook: `enum`s](https://www.typescriptlang.org/docs/handbook/enums.html)
