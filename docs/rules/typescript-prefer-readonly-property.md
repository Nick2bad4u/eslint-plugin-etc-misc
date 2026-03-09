# typescript/prefer-readonly-property

Require readonly class and interface properties.

## Rule Details

This rule reports writable `PropertyDefinition` and `TSPropertySignature` members.

### ❌ Incorrect

```ts
class C {
    value: string;
}
```

### ✅ Correct

```ts
class C {
    readonly value: string;
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
            "etc-misc/typescript/prefer-readonly-property": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if mutable properties are part of your coding conventions.

> **Rule catalog ID:** R100

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
