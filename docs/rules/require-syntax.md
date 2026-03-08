# require-syntax

Require syntax matched by configured AST selectors.

## Rule Details

This rule reports when a configured selector has no matches in the file.

### ❌ Incorrect

```ts
const x = 1;
```

with options:

```ts
{ selectors: ["ExportDefaultDeclaration"] }
```

### ✅ Correct

```ts
export default 1;
```

with options:

```ts
{ selectors: ["ExportDefaultDeclaration"] }
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
            "etc-misc/require-syntax": [
                "error",
                { selectors: ["ExportDefaultDeclaration"] },
            ],
        },
    },
];
```

## When Not To Use It

Disable this rule if files should not be forced to contain specific syntax forms.
