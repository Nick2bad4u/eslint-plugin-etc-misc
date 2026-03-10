# restrict-identifier-characters

Require identifiers to contain only english characters, digits, underscore, or dollar sign.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports identifiers that include characters outside `$`, latin letters, digits, and `_`.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
const абв = 1;
```

## ✅ Correct

```ts
const $x1 = 2;
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
            "etc-misc/restrict-identifier-characters": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase allows non-latin identifier names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R064

## Further reading

- [MDN: Lexical grammar (Identifiers)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
