# typescript/no-unsafe-object-assign

Disallow `Object.assign` into readonly-typed targets.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule uses TypeScript type information to detect `Object.assign` calls where the target type has readonly properties.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
type Target = { readonly x: number };
const target: Target = { x: 1 };
Object.assign(target, { x: 2 });
```

## ✅ Correct

```ts
type Target = { x: number };
const target: Target = { x: 1 };
Object.assign(target, { x: 2 });
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
            "etc-misc/typescript/no-unsafe-object-assign": "error",
        },
    },
];
```

## When not to use it

Disable this rule if readonly object mutation via `Object.assign` is intentionally allowed.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R093

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
