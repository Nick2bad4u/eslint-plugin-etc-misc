# no-self-import

Disallow importing the current file from itself.

## Rule Details

This rule reports relative import/export sources that resolve back to the same file.

### ❌ Incorrect

```ts
// filename: file.ts
import value from "./file";
```

### ✅ Correct

```ts
// filename: file.ts
import value from "./other-file";
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
            "etc-misc/no-self-import": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your build tooling intentionally supports self-import patterns.
