# no-chain-coalescence-mixture

Disallow mixing optional chaining and nullish coalescing in one expression.

## Rule Details

This rule reports expressions like `foo?.bar ?? fallback`.

### ❌ Incorrect

```ts
foo?.bar ?? fallback;
```

### ✅ Correct

```ts
foo?.bar;
foo ?? fallback;
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
            "etc-misc/no-chain-coalescence-mixture": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project permits `?.` and `??` in the same expression.

> **Rule catalog ID:** R019

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
