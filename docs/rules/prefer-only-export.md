# prefer-only-export

Disallow additional exports alongside a default export.

## Rule Details

This rule reports programs that include a `default` export and any additional export.

### ❌ Incorrect

```ts
export default 1;
export const x = 1;
```

### ✅ Correct

```ts
export default 1;
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
            "etc-misc/prefer-only-export": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if combining default and named exports is allowed in your modules.
