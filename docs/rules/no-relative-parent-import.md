# no-relative-parent-import

Disallow relative parent imports such as `".."` and `"../*"`.

## Targeted pattern scope

This rule reports module sources that traverse to parent directories using
patterns like `..`, `../**`, `../../**`, and deeper defaults.

It applies to import/export source strings and dynamic import strings.

## What this rule reports

This rule reports imports/exports that traverse parent directories. It helps enforce local-only imports or alias-based module boundaries.

## Why this rule exists

Preventing parent-relative imports helps enforce bounded module layers and
reduces coupling across directory boundaries.

## ❌ Incorrect

```ts
import service from "../service";
export * from "../../utils";
```

## ✅ Correct

```ts
import service from "./service";
import utils from "@/utils";
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`import/no-relative-parent-imports`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-parent-imports.md)

## Behavior and migration notes

This rule is deprecated in favor of
`import/no-relative-parent-imports` from `eslint-plugin-import`.

It reports only and does not provide an autofix.

### Options

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

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
// default disallow includes ../** and ../../**
const mod = await import("../shared/mod");
// ❌ reported

import mod from "@/shared/mod";
// ✅ valid when alias paths are allowed by your resolver
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

## When not to use it

Disable this rule if parent-relative imports are an accepted part of your module layout.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R036

## Further reading

- [eslint-plugin-import: no-relative-parent-imports](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-parent-imports.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
