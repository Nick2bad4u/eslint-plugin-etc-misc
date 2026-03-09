# typescript/no-unsafe-object-assignment

Disallow assignments to targets with readonly properties.

## Rule Details

This rule enforces the documented pattern for `typescript/no-unsafe-object-assignment`.

## Options

This rule supports default behavior unless configured otherwise.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/no-unsafe-object-assignment": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if the enforced convention does not fit your codebase requirements.

> **Rule catalog ID:** R094

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
