# switch-case-spacing

Enforce consistent spacing and break placement in switch cases.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@stylistic/switch-colon-spacing`](https://eslint.style/rules/switch-colon-spacing)

## Rule Details

This rule reports switch case bodies that do not match the expected spacing/break style.

### ❌ Incorrect

```ts
switch (x) {
    case 1:
        foo();
}
```

### ✅ Correct

```ts
switch (x) {
    case 1: {
        foo();
        break;
    }
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
            "etc-misc/switch-case-spacing": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your switch formatting is handled by a different style policy.
