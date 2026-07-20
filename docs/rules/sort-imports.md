# sort-imports

Sort ECMAScript imports and their named specifiers with deterministic fixes.

## Targeted pattern scope

This rule sorts contiguous static import declarations and named import
specifiers. It does not sort `require(...)` calls or dynamic imports.

## What this rule reports

This rule adapts `eslint-plugin-simple-import-sort/imports`. It reports one
diagnostic for each unsorted contiguous import chunk and fixes the complete
chunk.

The default groups are:

1. Side-effect imports, kept in their original relative order.
2. `node:` built-ins.
3. packages.
4. absolute and otherwise unmatched imports.
5. relative imports.

Within groups, sources are sorted case-insensitively with numeric ordering and
a deterministic code-point tie-break. Type imports precede value imports for
the same source; namespace imports precede default imports, which precede
named-only imports. Named specifiers are also sorted.

## Why this rule exists

One deterministic import order removes review churn and makes duplicate or
misplaced dependencies easier to spot.

## ❌ Incorrect

```ts
import local from "./local";
import packageValue from "package";
import { zebra, alpha } from "./names";
```

## ✅ Correct

```ts
import packageValue from "package";

import { alpha, zebra } from "./names";
import local from "./local";
```

## Behavior and migration notes

```ts
type Options = [{ groups?: string[][] }];
```

Each string is a Unicode regular expression. Every import source is tested
against every expression; the longest match wins and the first expression wins
ties. Inner arrays are separated by one newline and outer arrays by a blank
line. Unmatched imports are placed last.

The sorter uses an internal marker before side-effect sources and after type
sources, allowing custom groups to distinguish them as documented upstream.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/sort-imports": "warn" },
 },
];
```

Do not enable this rule with another import-ordering rule or a formatter that
also sorts imports.

## When not to use it

Disable it when import order is intentionally semantic, when `require(...)`
must be sorted, or when another tool owns import ordering.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R095

## Further reading

### Upstream source

Adapted from
[`eslint-plugin-simple-import-sort`](https://github.com/lydell/eslint-plugin-simple-import-sort).

### Additional resources

- [Upstream sort order](https://github.com/lydell/eslint-plugin-simple-import-sort#sort-order)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
