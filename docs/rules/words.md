# words

Disallow vague or weak wording in comments.

## Targeted pattern scope

This rule targets source-code comments.

## What this rule reports

This rule reports weak, vague, or overly wordy phrasing in comments.

## Why this rule exists

Ambiguous comment language reduces maintainability and leaves intent unclear.

## ❌ Incorrect

```ts
// this probably works
const value = 1;
```

## ✅ Correct

```ts
// this works for positive integers
const value = 1;
```

## Behavior and migration notes

This rule forwards options and behavior to
`write-good-comments/write-good-comments`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`write-good-comments/write-good-comments`](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2)

## Additional examples

```ts
// It should probably maybe work for most inputs.
// ❌ likely reported by write-good-comments checks

// Handles positive integers and returns false for negative values.
// ✅ clearer and more precise
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/words": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your team does not want prose-quality checks for comments.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R105

## Further reading

- [eslint-plugin-write-good-comments-2](https://github.com/Nick2bad4u/eslint-plugin-write-good-comments-2)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
