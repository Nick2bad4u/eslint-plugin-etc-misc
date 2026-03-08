# prefer-arrow-function-property

Require arrow-function properties when `this` is not required.

## Rule Details

This rule reports object properties implemented as non-`this` function expressions or method shorthand.

### ❌ Incorrect

```ts
const x = {
    f() {},
    g: function () {},
};
```

### ✅ Correct

```ts
const y = {
    f: () => {},
    g(this: void) {},
    h: function (this: void) {},
};
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
            "etc-misc/prefer-arrow-function-property": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your code style prefers method shorthand or regular function properties.

## Further Reading

- [MDN: Arrow function expressions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [TypeScript: `this` parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)
