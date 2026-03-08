# consistent-source-extension

Require consistent import/export source paths without file extensions.

## Rule Details

This rule reports import/export paths that end with `.js`, `.json`, or `.ts`.

### ❌ Incorrect

```ts
import x1 from "source.js";
import x2 from "source.json";
import x3 from "source.ts";
```

### ✅ Correct

```ts
import x1 from "source";
import x2 from "source";
import x3 from "source";
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
            "etc-misc/consistent-source-extension": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your module resolver requires explicit source file extensions.

## Further Reading

- [TypeScript: `moduleResolution` reference](https://www.typescriptlang.org/tsconfig/#moduleResolution)
- [Node.js ECMAScript modules](https://nodejs.org/api/esm.html)
