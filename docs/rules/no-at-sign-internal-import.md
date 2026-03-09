# no-at-sign-internal-import

Disallow internal alias imports under `"@/"`.

## Rule Details

This rule reports source strings that match `"@/**"`. It is useful when `@` should be reserved for package roots and not direct internal alias paths.

### ❌ Incorrect

```ts
import value from "@/feature";
```

### ✅ Correct

```ts
import value from "@";
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
    "disallow": ["@/**"]
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-at-sign-internal-import": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if `@/` internal alias imports are part of your standard architecture.

> **Rule catalog ID:** R018

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
