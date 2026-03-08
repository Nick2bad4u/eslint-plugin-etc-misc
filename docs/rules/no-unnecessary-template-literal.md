# no-unnecessary-template-literal

Disallow template literals that contain no expressions.

## Rule Details

This rule reports template literals with zero `${...}` expressions.

### ❌ Incorrect

```ts
const x = `value`;
```

### ✅ Correct

```ts
const x = `value ${suffix}`;
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
            "etc-misc/no-unnecessary-template-literal": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project intentionally uses expression-free template literals.
