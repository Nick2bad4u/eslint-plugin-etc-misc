# typescript/no-complex-declarator-type

Disallow complex inferred declarator types without explicit annotation.

## Rule Details

This rule reports variable declarators with complex assertions/inference when no explicit type annotation is present.

### ❌ Incorrect

```ts
const value = (() => 1) as (() => number);
```

### ✅ Correct

```ts
const value: () => number = (() => 1) as (() => number);
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
            "etc-misc/typescript/no-complex-declarator-type": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project allows complex inferred declarator types without annotations.

> **Rule catalog ID:** R086

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
