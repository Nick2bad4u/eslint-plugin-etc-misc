# typescript/no-multi-type-tuples

Disallow union element types directly inside tuple elements.

## Rule Details

This rule reports tuple elements written as unions (for example, `[A | B]`).

### ❌ Incorrect

```ts
type T = [string | number];
```

### ✅ Correct

```ts
type Value = string | number;
type T = [Value];
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
            "etc-misc/typescript/no-multi-type-tuples": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if inline union tuple element types are preferred in your project.

> **Rule catalog ID:** R090

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
