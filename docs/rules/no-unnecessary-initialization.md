# no-unnecessary-initialization

Disallow unnecessary initialization to `undefined`.

## Rule Details

This rule reports variables and class fields explicitly initialized with `undefined`.

### ❌ Incorrect

```ts
const value = undefined;
class C {
    field = undefined;
}
```

### ✅ Correct

```ts
const value = 1;
class C {
    field = 1;
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
            "etc-misc/no-unnecessary-initialization": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project prefers explicit `undefined` initializers for clarity.
