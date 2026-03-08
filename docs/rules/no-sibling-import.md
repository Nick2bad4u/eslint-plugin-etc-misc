# no-sibling-import

Disallow sibling-file imports from the current directory.

## Rule Details

This rule reports source paths that match `./*` by default.

### ❌ Incorrect

```ts
import value from "./source";
```

### ✅ Correct

```ts
import value from "../source";
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
{ "disallow": ["./*"] }
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-sibling-import": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if sibling imports are part of your module design.
