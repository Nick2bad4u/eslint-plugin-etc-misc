# no-param-reassign

Disallow function parameter reassignment outside the first expression statement.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports parameter reassignment except in the first expression statement in the function body.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
function f(value: number) {
    sideEffect();
    value += 1;
}
```

## ✅ Correct

```ts
function f(value: number) {
    value += 1;
    sideEffect();
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
            "etc-misc/no-param-reassign": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase allows unrestricted parameter mutation.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R035

## Further reading

- [MDN: Function parameters](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
