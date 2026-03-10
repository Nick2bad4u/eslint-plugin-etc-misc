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
- **Use instead:** [`write-good-comments/write-good-comments`](https://github.com/kantord/eslint-plugin-write-good-comments)

## Additional examples

```ts
// Add project-specific examples here when edge cases matter.
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

> **Rule catalog ID:** R079

## Further reading

- [eslint-plugin-write-good-comments](https://github.com/kantord/eslint-plugin-write-good-comments)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
