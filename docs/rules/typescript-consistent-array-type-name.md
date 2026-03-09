# typescript/consistent-array-type-name

Enforce consistent naming for array-like type aliases.

## Rule Details

This rule reports array-like type aliases whose names do not end in `Array` or `s`.

### ❌ Incorrect

```ts
type Item = string[];
```

### ✅ Correct

```ts
type Items = string[];
type ItemArray = Array<string>;
```

## Options

This rule has no options.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/consistent-array-type-name": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your team does not enforce array-type alias naming conventions.

> **Rule catalog ID:** R082

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
