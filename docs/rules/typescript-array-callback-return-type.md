# typescript/array-callback-return-type

Require explicit return types for array callback functions.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule inspects callbacks that are:

- passed as the **first argument** to a member call,
- missing an explicit return type annotation, and
- used with array callback methods such as `map`, `flatMap`, `find`, `some`,
  `every`, and `forEach`.

The receiver must resolve (via the TypeScript type checker) to an array-like
type: `Array`, tuple, union-of-arrays, or `ReadonlyArray`.

### Type checking

This rule uses parser services and TypeScript's type checker to avoid false
positives on user-defined methods that happen to share method names like `map`.

## What this rule reports

This rule reports callback functions used in supported array methods when the
callback does not declare an explicit return type.

## Why this rule exists

In larger codebases, inferred callback return types can become non-obvious after
refactors. Requiring explicit return types on array callbacks improves review
clarity and catches accidental return-shape drift earlier.

## ❌ Incorrect

```ts
[1, 2, 3].map((value) => value + 1);
```

```ts
users.find((user) => user.id === targetId);
```

## ✅ Correct

```ts
[1, 2, 3].map((value): number => value + 1);
```

```ts
users.find((user): boolean => user.id === targetId);
```

```ts
const collection = {
 map: (callback: (value: number) => number): number => callback(1),
};

collection.map((value) => value + 1);
```

## Behavior and migration notes

This rule has no autofix because adding return types requires semantic intent.

Adopt gradually:

1. Enable as `warn` on TypeScript-only packages.
2. Add explicit callback return types in touched files first.
3. Promote to `error` once the baseline is clean.

### Options

This rule has no options.

## Additional examples

```ts
const scores = [2, 4, 6] as const;

const doubled = scores.map((score): number => score * 2);
```

```ts
const custom = {
 map: <T>(value: T): T => value,
};

custom.map((value: number) => value + 1);
// Not reported: receiver is not typed as an array-like value.
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

Disable this rule if your team prefers inference-first style and does not want
explicit callback return types on common array operations.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R080

## Further reading

- [TypeScript handbook: function return types](https://www.typescriptlang.org/docs/handbook/2/functions.html#return-type-annotations)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
