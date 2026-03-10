# comment-spacing

Enforce consistent blank-line spacing after comments.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule enforces the documented pattern for `comment-spacing`.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
// Example that violates this rule.
```

## ✅ Correct

```ts
// Example that follows this rule.
```

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

This rule supports default behavior unless configured otherwise.

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
            "etc-misc/comment-spacing": "error",
        },
    },
];
```

## When not to use it

Disable this rule if the enforced convention does not fit your codebase requirements.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R003

## Further reading

- [ESLint: `spaced-comment`](https://eslint.org/docs/latest/rules/spaced-comment)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
