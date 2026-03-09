# no-unnecessary-as-const

Disallow unnecessary `as const` assertions.

## Rule Details

This rule reports `as const` assertions that do not provide additional value, such as empty object assertions or assertions on values already constrained by explicit type annotations.

### ❌ Incorrect

```ts
const x = {} as const;
const y: I = { value: 1 } as const;
```

### ✅ Correct

```ts
const z = { value: 1 } as const;
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
            "etc-misc/no-unnecessary-as-const": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase intentionally keeps these `as const` assertions for explicitness.

> **Rule catalog ID:** R045

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
