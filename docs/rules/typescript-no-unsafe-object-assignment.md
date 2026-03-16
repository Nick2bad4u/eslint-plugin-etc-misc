# typescript/no-unsafe-object-assignment

Disallow assignments to targets with readonly properties.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule is a TypeScript-prefixed alias of
`typescript/no-unsafe-object-assign`.

It reports `Object.assign(...)` calls where the target type has readonly
properties.

## What this rule reports

This rule reports `Object.assign` calls that attempt to mutate readonly-typed
targets.

## Why this rule exists

Mutating readonly-shaped targets through `Object.assign` bypasses the intent of
readonly contracts and can hide unsafe state changes.

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

This rule reports only and does not provide an autofix.

Use immutable update patterns or non-readonly target types when mutation is
intentional.

### Options

This rule has no options.

## Additional examples

```ts
const readonlyTarget: Readonly<{ value: number }> = { value: 1 };
Object.assign(readonlyTarget, { value: 2 });
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-unsafe-object-assignment": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally permits mutating readonly-typed
targets via `Object.assign`.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R102

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
