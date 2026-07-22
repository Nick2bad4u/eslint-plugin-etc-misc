# typescript/no-complex-return-type

Disallow complex inferred return types for arrow functions.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`@typescript-eslint/explicit-function-return-type`](https://typescript-eslint.io/rules/explicit-function-return-type/)

The replacement provides the maintained, configurable return-type policy. It is
broader than this rule's arrow-function-only heuristic, so review its options
before enabling it across an existing codebase.

## Targeted pattern scope

This rule targets arrow functions with no explicit return type annotation when
their returned expression is a type assertion around a complex expression.

Specifically, it matches asserted return expressions whose asserted value is a
function expression, arrow function expression, object expression, or class
expression.

## What this rule reports

This rule reports arrow functions with complex asserted return expressions when no explicit return type is declared.

## Why this rule exists

Complex asserted return expressions can hide the intended API shape.

An explicit return annotation makes the contract visible at the function
boundary.

## ❌ Incorrect

```ts
const create = () => (() => 1) as () => number;
```

## ✅ Correct

```ts
const create = (): (() => number) => () => 1;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is typically adding an explicit return type annotation to the arrow
function.

### Options

This rule has no options.

## Additional examples

```ts
const create = () => ({ run() {} }) as { run(): void };
// ❌ reported: complex asserted return expression and no return annotation

const createTyped = (): { run(): void } => ({ run() {} });
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-complex-return-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your team allows complex inferred return types without explicit annotations.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R114

## Further reading

- [TypeScript: Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
