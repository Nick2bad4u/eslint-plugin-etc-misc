# require-jsdoc

Require JSDoc comments for configured declaration kinds.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`jsdoc/require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md)

## Rule Details

This rule reports declarations of configured `kinds` when they do not have a leading JSDoc block comment.

### ❌ Incorrect

```ts
function f() {}
```

with options:

```ts
{ kinds: ["function"] }
```

### ✅ Correct

```ts
/** docs */
function f() {}
```

with options:

```ts
{ kinds: ["function"] }
```

## Options

```ts
type Kind = "arrow-function" | "class" | "function" | "method" | "type";

type Options = {
    kinds?: Kind[];
};
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/require-jsdoc": ["error", { kinds: ["function"] }],
        },
    },
];
```

## When Not To Use It

Disable this rule if your code style does not require JSDoc for declarations.
