# typescript/require-this-void

Require `this: void` on static class methods.

## Rule Details

This rule reports static class methods that do not declare a `this: void` parameter.

### ❌ Incorrect

```ts
class C {
    static f() {}
}
```

### ✅ Correct

```ts
class C {
    static f(this: void) {}
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
            "etc-misc/typescript/require-this-void": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project does not enforce explicit static-method `this` typing.

> **Rule catalog ID:** R103

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
