# typescript/require-prop-type-annotation

Require type annotations for class properties without initializers.

## Rule Details

This rule reports class properties that have no initializer and no type annotation.

### ❌ Incorrect

```ts
class C {
    value;
}
```

### ✅ Correct

```ts
class C {
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
            "etc-misc/typescript/require-prop-type-annotation": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if implicit `any`-style property declarations are allowed.

> **Rule catalog ID:** R102

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
