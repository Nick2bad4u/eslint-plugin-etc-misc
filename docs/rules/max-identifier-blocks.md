# max-identifier-blocks

Restrict identifier complexity to at most four casing blocks.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports identifiers that contain more than four casing blocks (for example, `AaaBbbCccDddEee`).

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
const AaaBbbCccDddEee = 1;
function aaaBbbCccDddEee() {}
```

## ✅ Correct

```ts
const AaaBbbCccDdd = 1;
function aaaBbbCccDdd() {}
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
            "etc-misc/max-identifier-blocks": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project allows long compound identifier names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R015

## Further reading

- [TypeScript Handbook: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
