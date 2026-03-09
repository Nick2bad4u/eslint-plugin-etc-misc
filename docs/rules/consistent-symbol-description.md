# consistent-symbol-description

Require consistent kebab-case Symbol descriptions.

## Rule Details

This rule reports `Symbol(...)` descriptions that are not lower-case kebab-case (with optional double-underscore separators).

### ❌ Incorrect

```ts
const x = Symbol("PascalCase");
```

### ✅ Correct

```ts
const x = Symbol("kebab-case__kebab-case");
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
            "etc-misc/consistent-symbol-description": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase intentionally allows other naming styles for Symbol descriptions.

> **Rule catalog ID:** R010

## Further Reading

- [MDN: `Symbol()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/Symbol)
- [MDN: Template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)
