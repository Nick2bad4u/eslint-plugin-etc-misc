# no-self-import

Disallow importing the current file from itself.

## Targeted pattern scope

This rule resolves relative import/export sources from the current file and
reports when a source points back to the same file path.

It checks:

- `ImportDeclaration`
- `ExportNamedDeclaration` with `source`
- `ExportAllDeclaration`
- dynamic `ImportExpression`

## What this rule reports

This rule reports relative import/export sources that resolve back to the same file.

## Why this rule exists

Self-imports create circular module references and are usually accidental.
Preventing them avoids confusing runtime and bundler behavior.

## ❌ Incorrect

```ts
// filename: file.ts
import value from "./file";
```

## ✅ Correct

```ts
// filename: file.ts
import value from "./other-file";
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`import/no-self-import`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md)

## Behavior and migration notes

This rule is deprecated in favor of `import/no-self-import` from
`eslint-plugin-import`.

Plan migration by enabling the replacement rule, fixing violations, then
removing `etc-misc/no-self-import`.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
// filename: src/utils/math.ts
export * from "./math";
// ❌ reported (self re-export)

// filename: src/utils/math.ts
export * from "./format";
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-self-import": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your build tooling intentionally supports self-import patterns.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R039

## Further reading

- [eslint-plugin-import: `no-self-import`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
