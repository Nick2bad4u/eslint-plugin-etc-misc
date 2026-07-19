# sort-array

Enforce alphabetical sorting for literal array elements.

## Targeted pattern scope

This rule checks `ArrayExpression` nodes and only analyzes arrays where every
non-empty element is a literal value (`Literal`).

If any element is non-literal (for example identifier, function call, template
expression, or spread), the array is skipped.

## What this rule reports

This rule reports array literals whose sortable elements are not in ascending
alphabetical order (using `localeCompare` on each literal coerced to string).

The rule provides an autofix that reorders the sortable elements.

## Why this rule exists

Canonical ordering in static lists reduces merge conflicts and makes lookups
faster during code review.

## ❌ Incorrect

```ts
const statuses = ["pending", "active", "archived"];
```

## ✅ Correct

```ts
const statuses = ["active", "archived", "pending"];
```

## Behavior and migration notes

This rule is autofixable and safe for static literal arrays.

Important caveat: literal values are sorted as strings. Numeric arrays are
therefore ordered lexicographically (`10` before `2`).

### Options

This rule has no options.

## Additional examples

```ts
const labels = ["beta", "alpha"];
// ❌ reported and autofixed

const dynamic = [prefix, "alpha"];
// ✅ ignored because not all elements are literals
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/sort-array": "error",
  },
 },
];
```

## When not to use it

Disable this rule when ordering carries semantic meaning (for example, priority
or display order), or when you need locale-specific/custom sorting semantics.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R068

## Further reading

- [MDN: `Array.prototype.sort()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
