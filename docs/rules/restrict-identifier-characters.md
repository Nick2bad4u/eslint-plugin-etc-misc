# restrict-identifier-characters

Require identifiers to contain only english characters, digits, underscore, or dollar sign.

## Rule Details

This rule reports identifiers that include characters outside `$`, latin letters, digits, and `_`.

### ❌ Incorrect

```ts
const абв = 1;
```

### ✅ Correct

```ts
const $x1 = 2;
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
            "etc-misc/restrict-identifier-characters": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase allows non-latin identifier names.

> **Rule catalog ID:** R064

## Further Reading

- [MDN: Lexical grammar (Identifiers)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers)
