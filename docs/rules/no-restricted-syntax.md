# no-restricted-syntax

Disallow syntax matched by configured AST selectors.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax)

## Rule Details

This rule reports nodes selected by any configured selector in `selectors`.

### ❌ Incorrect

```ts
if (x) {
    y();
}
```

with options:

```ts
{ selectors: ["IfStatement"] }
```

### ✅ Correct

```ts
for (;;) {
    break;
}
```

with options:

```ts
{ selectors: ["IfStatement"] }
```

## Options

```ts
type Options = {
    selectors?: Array<
        | string
        | {
              message?: string;
              selector: string;
          }
    >;
};
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-restricted-syntax": [
                "error",
                { selectors: ["IfStatement"] },
            ],
        },
    },
];
```

## When Not To Use It

Disable this rule if your project does not rely on selector-based syntax restrictions.

> **Rule catalog ID:** R037

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
