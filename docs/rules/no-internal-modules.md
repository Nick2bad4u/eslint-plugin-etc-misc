# no-internal-modules

Disallow importing nested internal module paths.

## Rule Details

This rule reports imports/exports that target internal module segments such as:

- `./folder/internal`
- `package/internal`
- `@scope/package/internal`

It allows top-level entry imports such as `./folder`, `package`, and `@scope/package`.

### ❌ Incorrect

```ts
import a from "./folder/internal";
import b from "package/internal";
import c from "@scope/package/internal";
```

### ✅ Correct

```ts
import a from "./folder";
import b from "package";
import c from "@scope/package";
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
    "disallow": ["./*/**", "[^@]*/**", "@?*/*/**"]
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-internal-modules": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project intentionally imports deep internal module paths.

> **Rule catalog ID:** R029

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)
