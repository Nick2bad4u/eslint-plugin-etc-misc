# no-relative-parent-import

Disallow relative parent imports such as `".."` and `"../*"`.

## Rule Details

This rule reports imports/exports that traverse parent directories. It helps enforce local-only imports or alias-based module boundaries.

### ❌ Incorrect

```ts
import service from "../service";
export * from "../../utils";
```

### ✅ Correct

```ts
import service from "./service";
import utils from "@/utils";
```

## Options

```ts
type Options = {
    allow?: string[];
    disallow?: string[];
};
```

Default `disallow` patterns include `".."`, `"../**"`, `"../.."`, `"../../**"`, and deeper parent traversals.

Use `allow` for specific exceptions:

```ts
{
    allow: ["../allowed-source"]
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-relative-parent-import": [
                "error",
                { allow: ["../allowed-source"] },
            ],
        },
    },
];
```

## When Not To Use It

Disable this rule if parent-relative imports are an accepted part of your module layout.
