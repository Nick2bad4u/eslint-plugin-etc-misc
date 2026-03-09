# sort-construct-signature

Require construct signatures to be the first member in interfaces.

## Rule Details

This rule reports interface construct signatures when they are not the first member in the interface body.

### ❌ Incorrect

```ts
interface I {
    x: string;
    new (): string;
}
```

### ✅ Correct

```ts
interface I {
    new (): string;
    x: string;
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
            "etc-misc/sort-construct-signature": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if interface member order is not important in your style guide.

> **Rule catalog ID:** R068

## Further Reading

- [TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
