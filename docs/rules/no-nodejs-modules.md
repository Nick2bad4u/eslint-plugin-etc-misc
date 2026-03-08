# no-nodejs-modules

Disallow importing Node.js built-ins via the `node:` protocol.

## Rule Details

This rule reports source strings that match `"node:*"`.

### ❌ Incorrect

```ts
import fs from "node:fs";
```

### ✅ Correct

```ts
import fs from "fs";
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
    "disallow": ["node:*"]
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-nodejs-modules": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your codebase intentionally requires `node:`-prefixed imports.
