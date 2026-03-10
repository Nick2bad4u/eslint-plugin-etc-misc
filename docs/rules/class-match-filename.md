# class-match-filename

Require class declarations to match the current filename.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports class declarations whose identifier does not exactly match the source filename stem.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
// filename: ClassName.ts
export class NotClassName {}
```

## ✅ Correct

```ts
// filename: ClassName.ts
export class ClassName {}
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
            "etc-misc/class-match-filename": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally allows class names that do not mirror file names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R002

## Further reading

- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
