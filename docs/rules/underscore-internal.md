# underscore-internal

Disallow `@internal` APIs that are not underscore-prefixed.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports declarations tagged with `@internal` when their names do not begin with `_`.

The convention makes internal-only APIs visually obvious and helps prevent accidental public use.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
/** @internal */
export function parseSecret(): void {}
```

```ts
export interface Thing {
    /** @internal */
    compute(): number;
}
```

## ✅ Correct

```ts
/** @internal */
export function _parseSecret(): void {}
```

```ts
export interface Thing {
    /** @internal */
    _compute(): number;
}
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
            "etc-misc/underscore-internal": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project uses a different naming convention for internal APIs.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R076

## Further reading

- [TSDoc `@internal` tag](https://tsdoc.org/pages/tags/internal/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
