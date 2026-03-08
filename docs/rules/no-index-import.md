# no-index-import

Disallow importing directly from `"."`.

## Rule Details

This rule reports import and export source strings that are exactly `"."`.

### ❌ Incorrect

```ts
import value from ".";
export { value } from ".";
```

### ✅ Correct

```ts
import value from "./feature";
export { value } from "./feature";
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
    "disallow": ["."]
}
```

- `allow`: glob patterns that are exempted.
- `disallow`: override default disallow patterns.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-index-import": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project intentionally uses `"."` barrel imports.
