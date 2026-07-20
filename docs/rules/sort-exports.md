# sort-exports

Sort named export specifiers and contiguous re-export declarations.

## Targeted pattern scope

This rule sorts named export specifiers and contiguous declarations that
re-export from another module.

## What this rule reports

This rule adapts `eslint-plugin-simple-import-sort/exports`.

- Named specifiers inside `export { ... }` are sorted.
- Contiguous `export ... from` and `export * from` declarations are sorted by
  source.
- A standalone leading comment starts a manual re-export group. Groups remain
  in their authored order.
- variable, function, class, type, and default export declarations are not
  reordered.

## Why this rule exists

Stable export ordering reduces review churn while preserving authored order for
declarations whose execution or initialization order may matter.

## ❌ Incorrect

```ts
export { zebra, alpha };
export * from "./zebra";
export * from "./alpha";
```

## ✅ Correct

```ts
export { alpha, zebra };
export * from "./alpha";
export * from "./zebra";
```

```ts
export * from "./zebra";

// This comment intentionally starts another group.
export * from "./alpha";
```

## Behavior and migration notes

This rule has no options. It is automatically fixable and preserves comments
and authored whitespace as far as the upstream sorter can safely associate
them with moved declarations or specifiers.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/sort-exports": "warn" },
 },
];
```

## When not to use it

Disable it when re-export order is intentionally meaningful to a bundler or
when another formatter or lint rule owns export ordering.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R094

## Further reading

### Upstream source

Adapted from
[`eslint-plugin-simple-import-sort`](https://github.com/lydell/eslint-plugin-simple-import-sort).

### Additional resources

- [MDN: `export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
