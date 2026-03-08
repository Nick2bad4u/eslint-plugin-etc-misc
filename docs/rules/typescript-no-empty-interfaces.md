# typescript/no-empty-interfaces

Disallow empty interfaces without `extends` clauses.

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
