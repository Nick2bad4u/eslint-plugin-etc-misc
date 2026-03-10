# no-const-enum

Disallow TypeScript `const enum` declarations.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports `const enum` declarations. `const enum` relies on TypeScript-specific inlining behavior and can cause compatibility issues in mixed toolchains.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
const enum Status {
    Ready,
    Running,
}
```

## ✅ Correct

```ts
enum Status {
    Ready,
    Running,
}
```

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

```ts
type Options = {
    allowLocal?: boolean;
};
```

Default: `{ allowLocal: false }`

### `allowLocal`

When `true`, non-exported `const enum` declarations are allowed.

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
            "etc-misc/no-const-enum": ["error", { allowLocal: true }],
        },
    },
];
```

## When not to use it

Disable this rule if your project explicitly depends on `const enum` inlining and your build toolchain guarantees consistent handling.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R021

## Further reading

- [TypeScript Handbook: Const enums](https://www.typescriptlang.org/docs/handbook/enums.html#const-enums)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
