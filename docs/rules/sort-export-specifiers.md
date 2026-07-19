# sort-export-specifiers

Enforce alphabetical sorting of named export specifiers.

## Targeted pattern scope

This rule inspects `ExportNamedDeclaration` nodes that have at least two
`ExportSpecifier` entries.

Specifiers are sorted alphabetically by exported name.

## What this rule reports

This rule reports named export declarations whose specifier order is not
alphabetical.

It includes an autofix that rewrites the specifier segment.

## Why this rule exists

Alphabetical export lists are easier to scan and reduce merge conflict noise.

## ❌ Incorrect

```ts
export { zebra, alpha };
```

## ✅ Correct

```ts
export { alpha, zebra };
```

## Behavior and migration notes

This rule is fixable.

Because the fixer rewrites text in the specifier range, review `--fix` changes
carefully when using alias exports or complex formatting.

### Options

This rule has no options.

## Additional examples

```ts
export { C, A, B };
// ❌ reported, auto-fixed to A, B, C

export { A, B, C };
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/sort-export-specifiers": "error",
  },
 },
];
```

## When not to use it

Disable this rule if export ordering is intentionally semantic rather than
alphabetical.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R072

## Further reading

- [MDN: `export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
