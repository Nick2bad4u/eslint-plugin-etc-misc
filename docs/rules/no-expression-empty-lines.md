# no-expression-empty-lines

Disallow blank lines inside expression statements.

## Rule Details

This rule reports expression statements whose inner source text contains empty lines and auto-fixes by removing those empty lines.

### ❌ Incorrect

```ts
someCall(

    1
);
```

### ✅ Correct

```ts
someCall(
    1
);
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
            "etc-misc/no-expression-empty-lines": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if blank lines inside expressions are allowed for readability.
