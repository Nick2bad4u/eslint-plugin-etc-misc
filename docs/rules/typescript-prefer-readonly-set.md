# typescript/prefer-readonly-set

Require `ReadonlySet` instead of `Set` in type positions.

## Rule Details

This rule reports `Set` type references in TypeScript annotations.

### ❌ Incorrect

```ts
function f(values: Set<string>) {}
```

### ✅ Correct

```ts
function f(values: ReadonlySet<string>) {}
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
            "etc-misc/typescript/prefer-readonly-set": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if mutable sets are expected throughout your codebase.

> **Rule catalog ID:** R101

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
