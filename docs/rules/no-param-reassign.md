# no-param-reassign

Disallow function parameter reassignment outside the first expression statement.

## Rule Details

This rule reports parameter reassignment except in the first expression statement in the function body.

### ❌ Incorrect

```ts
function f(value: number) {
    sideEffect();
    value += 1;
}
```

### ✅ Correct

```ts
function f(value: number) {
    value += 1;
    sideEffect();
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
            "etc-misc/no-param-reassign": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase allows unrestricted parameter mutation.

## Further Reading

- [MDN: Function parameters](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions)
