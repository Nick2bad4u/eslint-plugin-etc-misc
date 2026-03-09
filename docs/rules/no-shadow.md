# no-shadow

Disallow shadowing variables from outer scopes.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-shadow`](https://typescript-eslint.io/rules/no-shadow)

## Rule Details

This rule reports variables that reuse names from outer scopes. Enum declarations are ignored.

### ❌ Incorrect

```ts
const x = 1;
function f() {
    const x = 2;
    return x;
}
```

### ✅ Correct

```ts
const x = 1;
function f() {
    const y = x + 1;
    return y;
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
            "etc-misc/no-shadow": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if shadowed variable names are acceptable in your code style.

## Further Reading

- [TypeScript Handbook: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)
