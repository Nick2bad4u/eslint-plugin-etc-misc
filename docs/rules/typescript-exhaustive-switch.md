# typescript/exhaustive-switch

Require a default branch in switch statements with multiple cases.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/switch-exhaustiveness-check`](https://typescript-eslint.io/rules/switch-exhaustiveness-check)

## Rule Details

This rule reports non-trivial switch statements that have no `default` case.

### ❌ Incorrect

```ts
switch (x) {
    case 1:
        break;
    case 2:
        break;
}
```

### ✅ Correct

```ts
switch (x) {
    case 1:
        break;
    default:
        break;
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
            "etc-misc/typescript/exhaustive-switch": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if you intentionally omit `default` cases.

> **Rule catalog ID:** R084

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
