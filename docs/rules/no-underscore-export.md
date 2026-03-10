# no-underscore-export

Disallow underscore-prefixed named exports.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports exported declarations whose identifier starts with `_`.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
export const _x = 1;
export function _f() {}
```

## ✅ Correct

```ts
export const x = 1;
export function f() {}
```

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

This rule has no options.

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
            "etc-misc/no-underscore-export": "error",
        },
    },
];
```

## When not to use it

Disable this rule if underscore-prefixed exports are part of your public API conventions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R044

## Further reading

- [MDN: `export`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
