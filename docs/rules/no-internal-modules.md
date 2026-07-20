# no-internal-modules

Disallow importing nested internal module paths.

## Targeted pattern scope

This rule matches import/export sources that look like deep/internal module
paths, using these default disallow globs:

- `./*/**`
- `[^@]*/**`
- `@?*/*/**`

## What this rule reports

This rule reports imports/exports that target internal module segments such as:

- `./folder/internal`
- `package/internal`
- `@scope/package/internal`

It allows top-level entry imports such as `./folder`, `package`, and `@scope/package`.

## Why this rule exists

It enforces package entrypoint usage instead of importing deep internal files.

## ❌ Incorrect

```ts
import a from "./folder/internal";
import b from "package/internal";
import c from "@scope/package/internal";
```

## ✅ Correct

```ts
import a from "./folder";
import b from "package";
import c from "@scope/package";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Use `allow` to carve out explicit exceptions while migrating toward public
entrypoint imports.

### Options

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

## Additional examples

```ts
// default disallow includes "@?*/*/**"
import c from "@scope/package/internal/file";
// ❌ reported

import c from "@scope/package";
// ✅ valid
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

## When not to use it

Disable this rule if your project intentionally imports deep internal module paths.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R043

## Further reading

- [Node.js package exports](https://nodejs.org/api/packages.html#exports)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
