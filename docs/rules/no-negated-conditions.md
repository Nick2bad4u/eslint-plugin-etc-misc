# no-negated-conditions

Disallow negated conditions.

## Rule Details

This rule reports selected negated patterns in conditions and top-level logical expressions, including `!foo` and `foo !== bar` forms.

### ❌ Incorrect

```ts
if (!x && y) {}
if (x !== 1 && y) {}
const value = !x || y;
```

### ✅ Correct

```ts
if (x && y) {}
if (x === 1 && y) {}
const value = x && y;
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
            "etc-misc/no-negated-conditions": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase intentionally allows negated condition forms.
