# typescript/prefer-class-method

Prefer class methods over untyped arrow-function class properties.

## Rule Details

This rule reports class property arrow functions that have no explicit property type annotation.

### ❌ Incorrect

```ts
class C {
    value = () => {};
}
```

### ✅ Correct

```ts
class C {
    value(): void {}
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
            "etc-misc/typescript/prefer-class-method": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if class-property arrow functions are your preferred pattern.
