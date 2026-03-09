# typescript/no-never

Disallow inferred identifier types of `never`.

## Rule Details

This rule uses TypeScript type checking to report identifiers inferred as `never`.

### ❌ Incorrect

```ts
const fail = (): never => {
    throw new Error("x");
};

const result = fail();
```

### ✅ Correct

```ts
type Never = never;
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
            "etc-misc/typescript/no-never": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if inferred `never` identifiers are accepted in your codebase.

> **Rule catalog ID:** R091

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
