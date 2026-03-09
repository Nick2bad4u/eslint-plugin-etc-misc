# typescript/array-callback-return-type

Require explicit return types for array callback functions.

## Rule Details

This rule reports callback functions passed to common **array/readonly-array** methods when no explicit return type is declared.

### ❌ Incorrect

```ts
[1, 2, 3].map((value) => value + 1);
```

### ✅ Correct

```ts
[1, 2, 3].map((value): number => value + 1);
```

```ts
const collection = {
    map: (callback: (value: number) => number): number => callback(1),
};

collection.map((value) => value + 1);
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
            "etc-misc/typescript/array-callback-return-type": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your team accepts inferred callback return types.

## Type Checking

This rule requires type information and only reports callbacks when the receiver is typed as an array-like value.
