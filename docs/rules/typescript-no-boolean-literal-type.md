# typescript/no-boolean-literal-type

Disallow optional boolean literal property types.

## Rule Details

This rule reports optional property declarations typed as `true` or `false`.

### ❌ Incorrect

```ts
interface Flags {
    on?: true;
}
```

### ✅ Correct

```ts
interface Flags {
    on?: boolean;
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
            "etc-misc/typescript/no-boolean-literal-type": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if optional literal booleans are part of your public type contracts.

> **Rule catalog ID:** R085

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
