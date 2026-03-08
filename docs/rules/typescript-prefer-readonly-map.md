# typescript/prefer-readonly-map

Require `ReadonlyMap` instead of `Map` in type positions.

## Rule Details

This rule reports `Map` type references in TypeScript annotations.

### ❌ Incorrect

```ts
function f(values: Map<string, string>) {}
```

### ✅ Correct

```ts
function f(values: ReadonlyMap<string, string>) {}
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
            "etc-misc/typescript/prefer-readonly-map": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if mutable maps are expected throughout your codebase.
