# typescript/no-empty-interfaces

Disallow empty interfaces without `extends` clauses.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-empty-object-type`](https://typescript-eslint.io/rules/no-empty-object-type)

## Rule Details

This rule reports interfaces that declare no members and no base interfaces.

### ❌ Incorrect

```ts
interface I {}
```

### ✅ Correct

```ts
interface I {
    value: string;
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
            "etc-misc/typescript/no-empty-interfaces": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if marker interfaces are intentionally used in your project.

> **Rule catalog ID:** R088

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
