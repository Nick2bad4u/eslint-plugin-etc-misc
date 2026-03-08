# typescript/no-inferrable-types

Disallow explicit primitive type annotations when the type is inferrable.

## Rule Details

This rule reports type annotations on variable/property declarations initialized with literals.

### ❌ Incorrect

```ts
const value: number = 1;
```

### ✅ Correct

```ts
const value = 1;
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
            "etc-misc/typescript/no-inferrable-types": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if explicit primitive annotations are required for readability.
