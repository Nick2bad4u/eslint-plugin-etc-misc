# sort-class-members

Enforce alphabetical sorting of class members.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule enforces the documented pattern for `sort-class-members`.

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

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`sort-class-members/sort-class-members`](https://www.npmjs.com/package/eslint-plugin-sort-class-members) or [Perfectionist sorting rules](https://perfectionist.dev/)

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

This rule supports default behavior unless configured otherwise.

### Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`sort-class-members/sort-class-members`](https://www.npmjs.com/package/eslint-plugin-sort-class-members) or [Perfectionist sorting rules](https://perfectionist.dev/)

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
            "etc-misc/sort-class-members": "error",
        },
    },
];
```

## When not to use it

Disable this rule if the enforced convention does not fit your codebase requirements.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R067

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
