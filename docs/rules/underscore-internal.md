# underscore-internal

Disallow `@internal` APIs that are not underscore-prefixed.

## Rule Details

This rule reports declarations tagged with `@internal` when their names do not begin with `_`.

The convention makes internal-only APIs visually obvious and helps prevent accidental public use.

### ❌ Incorrect

```ts
/** @internal */
export function parseSecret(): void {}
```

```ts
export interface Thing {
    /** @internal */
    compute(): number;
}
```

### ✅ Correct

```ts
/** @internal */
export function _parseSecret(): void {}
```

```ts
export interface Thing {
    /** @internal */
    _compute(): number;
}
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
            "etc-misc/underscore-internal": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project uses a different naming convention for internal APIs.

## Further Reading

- [TSDoc `@internal` tag](https://tsdoc.org/pages/tags/internal/)
