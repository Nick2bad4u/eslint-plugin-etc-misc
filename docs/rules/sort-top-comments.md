# sort-top-comments

Enforce alphabetical sorting of top-of-file comments.

## Targeted pattern scope

This rule inspects comments located before the first top-level program node.

Only that top-of-file comment region is considered.

## What this rule reports

If there are at least two top-of-file comments, this rule reports when their
order is not alphabetical.

An autofix rewrites that comment span in sorted order.

## Why this rule exists

Sorted file headers reduce churn in shared banner/comment blocks and make them
easier to scan.

## ❌ Incorrect

```ts
// zeta
// alpha
const value = 1;
```

## ✅ Correct

```ts
// alpha
// zeta
const value = 1;
```

## Behavior and migration notes

This rule is autofixable.

The fixer only rewrites the contiguous top comment span before the first
statement.

### Options

This rule has no options.

## Additional examples

```ts
/* zeta */
/* alpha */
import { run } from "./run";
// ❌ reported and reordered
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/sort-top-comments": "error",
  },
 },
];
```

## When not to use it

Disable this rule if top comments intentionally represent ordered execution
steps, chronological logs, or legal blocks with fixed sequence.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R097

## Further reading

- [MDN: `String.prototype.localeCompare()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
