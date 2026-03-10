# no-commented-out-code

Disallow comment blocks that appear to contain executable or declaration code.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

Commented-out code creates maintenance noise, hides stale implementation paths,
and can mislead readers into thinking dead code is still relevant. This rule
parses comments and reports ones that look like real code.

The rule intentionally ignores non-code commentary patterns like region markers
and plain prose notes.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
// const answer = 54;
const answer = 42;
```

```ts
class Example {
  public a: string;
  // public b: string;
  public c: string;
}
```

## ✅ Correct

```ts
// Explanation: historical implementation tried 54 first.
const answer = 42;
```

```ts
class Example {
  // #region Public API
  public execute(): void {}
  // #endregion
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-commented-code/no-commented-code`](https://www.npmjs.com/package/eslint-plugin-no-commented-code)

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

This rule has no options.

### Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-commented-code/no-commented-code`](https://www.npmjs.com/package/eslint-plugin-no-commented-code)

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
            "etc-misc/no-commented-out-code": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your team intentionally keeps commented examples inline
instead of using docs, snippets, or tests.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R020

## Further reading

- [ESLint: Working with Rules](https://eslint.org/docs/latest/extend/custom-rules)
- [TypeScript-ESLint: Custom Rules](https://typescript-eslint.io/developers/custom-rules/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
