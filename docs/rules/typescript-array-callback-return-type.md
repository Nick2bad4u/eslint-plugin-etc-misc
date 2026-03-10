# typescript/array-callback-return-type

Require explicit return types for array callback functions.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

### Type checking

This rule requires type information and only reports callbacks when the receiver is typed as an array-like value.

## What this rule reports

This rule reports callback functions passed to common **array/readonly-array** methods when no explicit return type is declared.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
[1, 2, 3].map((value) => value + 1);
```

## ✅ Correct

```ts
[1, 2, 3].map((value): number => value + 1);
```

```ts
const collection = {
    map: (callback: (value: number) => number): number => callback(1),
};

collection.map((value) => value + 1);
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
            "etc-misc/typescript/array-callback-return-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your team accepts inferred callback return types.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R080

## Further reading

- [TypeScript handbook: function return types](https://www.typescriptlang.org/docs/handbook/2/functions.html#return-type-annotations)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
