# no-underscore-export

Disallow underscore-prefixed named exports.

## Rule Details

This rule reports exported declarations whose identifier starts with `_`.

### ❌ Incorrect

```ts
export const _x = 1;
export function _f() {}
```

### ✅ Correct

```ts
export const x = 1;
export function f() {}
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
            "etc-misc/no-underscore-export": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if underscore-prefixed exports are part of your public API conventions.

> **Rule catalog ID:** R044

## Further Reading

- [MDN: `export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)
