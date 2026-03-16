# consistent-source-extension

Require consistent import/export source paths without file extensions.

## Targeted pattern scope

This rule reports string-literal module sources that end with these explicit
extensions:

- `.js`
- `.json`
- `.ts`

It applies to import/export sources and any matching source literal in supported
module syntax nodes.

## What this rule reports

This rule reports import/export paths that end with `.js`, `.json`, or `.ts`.

## Why this rule exists

Teams that standardize extensionless internal specifiers use this rule to keep
import/export declarations consistent.

## ❌ Incorrect

```ts
import x1 from "source.js";
import x2 from "source.json";
import x3 from "source.ts";
```

## ✅ Correct

```ts
import x1 from "source";
import x2 from "source";
import x3 from "source";
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`import/extensions`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md)

## Behavior and migration notes

This rule is deprecated in favor of `import/extensions`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
export * from "./utils.ts";
// ❌ reported

export * from "./utils";
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/consistent-source-extension": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your module resolver requires explicit source file extensions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R009

## Further reading

- [TypeScript: `moduleResolution` reference](https://www.typescriptlang.org/tsconfig/#moduleResolution)
- [Node.js ECMAScript modules](https://nodejs.org/api/esm.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
