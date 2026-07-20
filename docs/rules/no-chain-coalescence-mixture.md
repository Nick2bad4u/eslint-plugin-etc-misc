# no-chain-coalescence-mixture

Disallow mixing optional chaining and nullish coalescing in one expression.

## Targeted pattern scope

This rule reports `LogicalExpression` nodes using `??` where the left-hand side
is an optional chain (`ChainExpression`).

In practice, it flags patterns like `obj?.value ?? fallback`.

## What this rule reports

This rule reports expressions like `foo?.bar ?? fallback`.

## Why this rule exists

Combining optional chaining and nullish coalescing inline can hide intent and
make intermediate values harder to debug. Splitting steps improves readability.

## ❌ Incorrect

```ts
foo?.bar ?? fallback;
```

## ✅ Correct

```ts
foo?.bar;
foo ?? fallback;
```

```ts
const value = foo?.bar;
const result = value ?? fallback;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Typical migration is introducing an intermediate variable before applying `??`.

### Options

This rule has no options.

## Additional examples

```ts
const title = config?.labels?.title ?? "Untitled";
// ❌ reported

const maybeTitle = config?.labels?.title;
const titleSafe = maybeTitle ?? "Untitled";
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-chain-coalescence-mixture": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project permits `?.` and `??` in the same expression.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R025

## Further reading

- [MDN: Optional chaining (`?.`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [MDN: Nullish coalescing (`??`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
