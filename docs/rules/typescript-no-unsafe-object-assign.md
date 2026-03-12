# typescript/no-unsafe-object-assign

Disallow `Object.assign` into readonly-typed targets.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets calls matching `Object.assign(...)` and checks the first
argument's resolved TypeScript type.

## What this rule reports

This rule uses TypeScript type information to detect `Object.assign` calls where the target type has readonly properties.

## Why this rule exists

It prevents mutating targets whose type advertises readonly properties.

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

Prefer immutable copy patterns or avoid readonly target types when mutation is
required.

### Options

This rule has no options.

## Additional examples

```ts
const mutable = { count: 0 };
Object.assign(mutable, { count: 1 });
// ✅ valid

const readonlyTarget: Readonly<{ count: number }> = { count: 0 };
Object.assign(readonlyTarget, { count: 1 });
// ❌ reported
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

> **Rule catalog ID:** R094

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
