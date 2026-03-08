# typescript/no-complex-return-type

Disallow complex inferred return types for arrow functions.

## Rule Details

This rule reports arrow functions with complex asserted return expressions when no explicit return type is declared.

### ❌ Incorrect

```ts
const create = () => ((() => 1) as (() => number));
```

### ✅ Correct

```ts
const create = (): () => number => (() => 1);
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
            "etc-misc/typescript/no-complex-return-type": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your team allows complex inferred return types without explicit annotations.
