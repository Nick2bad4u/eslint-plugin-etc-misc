# max-identifier-blocks

Restrict identifier complexity to at most four casing blocks.

## Rule Details

This rule reports identifiers that contain more than four casing blocks (for example, `AaaBbbCccDddEee`).

### ❌ Incorrect

```ts
const AaaBbbCccDddEee = 1;
function aaaBbbCccDddEee() {}
```

### ✅ Correct

```ts
const AaaBbbCccDdd = 1;
function aaaBbbCccDdd() {}
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
            "etc-misc/max-identifier-blocks": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project allows long compound identifier names.

> **Rule catalog ID:** R015

## Further Reading

- [TypeScript Handbook: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)
