# no-at-sign-import

Disallow importing exactly from `"@"`.

## Rule Details

This rule reports source strings that are exactly `"@"`. It is useful when `@` is a namespace root marker and should not be imported as a module by itself.

### ❌ Incorrect

```ts
import value from "@";
```

### ✅ Correct

```ts
import value from "@/feature";
```

## Options

```ts
type Options = {
    allow?: string[];
    disallow?: string[];
};
```

Default:

```json
{
    "disallow": ["@"]
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-at-sign-import": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your tooling resolves `"@"` as a valid direct module import.

> **Rule catalog ID:** R017

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
