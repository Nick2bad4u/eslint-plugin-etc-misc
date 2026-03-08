# only-export-name

Restrict exports to configured names.

## Rule Details

This rule reports exports whose names are not included in `names`.

### ❌ Incorrect

```ts
export const value = 1;
```

with default options (`["default"]`).

### ✅ Correct

```ts
export default 1;
```

or:

```ts
export const value = 1;
```

with options:

```ts
{ names: ["value"] }
```

## Options

```ts
type Options = {
    names?: string[];
};
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/only-export-name": ["error", { names: ["value"] }],
        },
    },
];
```

## When Not To Use It

Disable this rule if exported symbol names do not need to be constrained.
