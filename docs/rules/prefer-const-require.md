# prefer-const-require

Require assigning `require(...)` calls to a `const` variable.

## Rule Details

This rule reports `require(...)` call sites that are not part of a variable declarator.

### ❌ Incorrect

```ts
function loadPath() {
    return require("node:path");
}
```

### ✅ Correct

```ts
const path = require("node:path");
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
            "etc-misc/prefer-const-require": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase permits inline or return-position `require(...)` usage.
