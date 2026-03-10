# typescript/require-this-void

Require `this: void` on static class methods.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports static class methods that do not declare a `this: void` parameter.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
class C {
    static f() {}
}
```

## ✅ Correct

```ts
class C {
    static f(this: void) {}
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
            "etc-misc/typescript/require-this-void": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project does not enforce explicit static-method `this` typing.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R103

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
