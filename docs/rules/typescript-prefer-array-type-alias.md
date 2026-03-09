# typescript/prefer-array-type-alias

Prefer reusable alias names for array and tuple type aliases.

## Rule Details

This rule reports array/tuple type aliases that do not follow preferred reusable alias naming.

### ❌ Incorrect

```ts
type Item = string[];
```

### ✅ Correct

```ts
type Items = string[];
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
            "etc-misc/typescript/prefer-array-type-alias": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project does not standardize alias naming for array and tuple types.

> **Rule catalog ID:** R095

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
