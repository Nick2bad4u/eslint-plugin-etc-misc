# typescript/define-function-in-one-statement

Require defining function properties in a single statement.

## Rule Details

This rule reports assignment expressions that attach properties to functions in separate statements.

### ❌ Incorrect

```ts
function f() {}
f.x = 1;
```

### ✅ Correct

```ts
const f = Object.assign(() => {}, { x: 1 });
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
            "etc-misc/typescript/define-function-in-one-statement": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if function property assignment across statements is accepted in your codebase.

> **Rule catalog ID:** R083

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
