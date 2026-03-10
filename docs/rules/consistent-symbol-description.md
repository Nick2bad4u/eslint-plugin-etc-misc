# consistent-symbol-description

Require consistent kebab-case Symbol descriptions.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports `Symbol(...)` descriptions that are not lower-case kebab-case (with optional double-underscore separators).

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
const x = Symbol("PascalCase");
```

## ✅ Correct

```ts
const x = Symbol("kebab-case__kebab-case");
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
            "etc-misc/consistent-symbol-description": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally allows other naming styles for Symbol descriptions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R010

## Further reading

- [MDN: `Symbol()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol/Symbol)
- [MDN: Template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
