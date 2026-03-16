# comment-spacing

Enforce consistent blank-line spacing after comments.

## Targeted pattern scope

This rule inspects every comment in the file and measures the number of blank
lines between the comment end and the next non-comment token.

Expected spacing is content-aware:

- **Line comments** (`// ...`) → no blank line after the comment.
- **Single-line block comments** (`/* ... */`) → no blank line after the
  comment.
- **Multiline block comments** (`/* ...\n... */`) → exactly one blank line
  after the comment.
- **ESLint directive block comments** (for example `/* eslint-disable */`) → no
  blank line after the comment.

## What this rule reports

This rule reports comments whose trailing blank-line spacing does not match the
expected spacing model above.

The rule is auto-fixable and rewrites only the whitespace between the comment
and the next token.

## Why this rule exists

Inconsistent spacing after comments makes scan-reading harder and causes noisy
diffs. A deterministic spacing rule keeps comment blocks visually consistent
across contributors and editors.

## ❌ Incorrect

```ts
/*
 * Renders the profile panel.
 */
const renderProfile = () => {
 // ...
};
```

```ts
// Validate and normalize input.

const normalize = (value: string) => value.trim();
```

## ✅ Correct

```ts
/*
 * Renders the profile panel.
 */

const renderProfile = () => {
 // ...
};
```

```ts
// Validate and normalize input.
const normalize = (value: string) => value.trim();
```

## Behavior and migration notes

This rule is autofixable (`fixable: "whitespace"`) and rewrites only the
whitespace between a comment and the next token.

Use `--fix-dry-run` in CI first if you want to preview spacing churn before
mass-apply.

### Options

This rule has no options.

## Additional examples

```ts
/* eslint-disable no-console */
const run = () => {
 console.log("allowed here");
};
```

```ts
/*
 * This multiline explanation is intentionally separated
 * from the code it introduces.
 */

const createTask = () => ({ id: crypto.randomUUID() });
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/comment-spacing": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your formatter or style guide intentionally uses different
post-comment spacing conventions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R003

## Further reading

- [ESLint: `spaced-comment`](https://eslint.org/docs/latest/rules/spaced-comment)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
