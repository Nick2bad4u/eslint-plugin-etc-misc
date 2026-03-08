# disallow-import

Disallow import/export sources by configured glob patterns.

## Rule Details

This rule matches import and export source values against `disallow` globs, with optional `allow` exceptions.

### ❌ Incorrect

```ts
import value from "../source";
```

with options:

```ts
{ disallow: ["../**"] }
```

### ✅ Correct

```ts
import value from "../source";
```

with options:

```ts
{ disallow: ["../**"], allow: ["../source"] }
```

## Options

```ts
type Options = {
    allow?: string[];
    disallow?: string[];
};
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/disallow-import": ["error", { disallow: ["../**"] }],
        },
    },
];
```

## When Not To Use It

Disable this rule if your project does not enforce import path restrictions.
