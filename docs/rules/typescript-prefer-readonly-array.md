# typescript/prefer-readonly-array

Require readonly array and tuple type annotations.

## Rule Details

This rule reports writable array and tuple type annotations.

### ❌ Incorrect

```ts
function f(values: string[]) {}
```

### ✅ Correct

```ts
function f(values: readonly string[]) {}
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
            "etc-misc/typescript/prefer-readonly-array": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if mutable arrays and tuples are preferred in your API design.
