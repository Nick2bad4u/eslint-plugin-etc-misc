# typescript/no-unsafe-object-assign

Disallow `Object.assign` into readonly-typed targets.

## Rule Details

This rule uses TypeScript type information to detect `Object.assign` calls where the target type has readonly properties.

### ❌ Incorrect

```ts
type Target = { readonly x: number };
const target: Target = { x: 1 };
Object.assign(target, { x: 2 });
```

### ✅ Correct

```ts
type Target = { x: number };
const target: Target = { x: 1 };
Object.assign(target, { x: 2 });
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
            "etc-misc/typescript/no-unsafe-object-assign": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if readonly object mutation via `Object.assign` is intentionally allowed.

> **Rule catalog ID:** R093

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
