# no-unnecessary-as-const

Disallow unnecessary `as const` assertions.

## Targeted pattern scope

This rule targets `as const` assertions inside variable declarators when they
are likely redundant:

- `{} as const` in variable initializers, and
- any `as const` initializer when the variable already has an explicit type
  annotation.

This is intentionally narrow and does not report every possible redundant
`as const` usage.

## What this rule reports

This rule reports `as const` assertions that do not provide additional value, such as empty object assertions or assertions on values already constrained by explicit type annotations.

## Why this rule exists

Redundant `as const` assertions add noise and can imply extra type precision
where none is actually gained.

## ❌ Incorrect

```ts
type I = { value: number };

const x = {} as const;
const y: I = { value: 1 } as const;
```

## ✅ Correct

```ts
const z = { value: 1 } as const;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Remove the assertion when it does not change the effective type contract.

### Options

This rule has no options.

## Additional examples

```ts
const options: Readonly<Record<string, string>> = {
 mode: "strict",
} as const;
// ❌ reported because variable already has explicit type annotation

const tuple = ["a", "b"] as const;
// ✅ currently not targeted by this rule
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-unnecessary-as-const": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your team prefers to keep `as const` for explicitness,
even when type annotations already constrain the value.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R046

## Further reading

- [TypeScript 3.4: `const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
