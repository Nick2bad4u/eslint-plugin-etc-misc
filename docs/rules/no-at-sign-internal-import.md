# no-at-sign-internal-import

Disallow internal alias imports under `"@/"`.

## Targeted pattern scope

This rule inspects module source strings in imports/exports and reports values
matching the default disallow glob `"@/**"`.

## What this rule reports

This rule reports source strings that match `"@/**"`. It is useful when `@` should be reserved for package roots and not direct internal alias paths.

## Why this rule exists

If your architecture reserves `@` for package-level entrypoints only, this rule
prevents deep internal alias imports.

## ❌ Incorrect

```ts
import value from "@/feature";
```

## ✅ Correct

```ts
import value from "@";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Typical migration is switching to package exports, public entrypoints, or
allowed local relative imports.

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
 "disallow": ["@/**"]
}
```

## Additional examples

```ts
// default disallow: ["@/**"]
import { helper } from "@/internal/helper";
// ❌ reported

import { helper } from "@";
// ✅ not matched by default pattern
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

## When not to use it

Disable this rule if `@/` internal alias imports are part of your standard architecture.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R018

## Further reading

- [Node.js packages: entry points and exports](https://nodejs.org/api/packages.html#exports)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
