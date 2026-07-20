# no-negated-conditions

Disallow negated conditions.

## Targeted pattern scope

This rule reports selected negation patterns in conditions:

- `if (!value)`
- `if (value !== other)`
- top-level logical combinations that include those negations (`&&` / `||`)

The selector is intentionally focused and does not rewrite all possible boolean
equivalences.

## What this rule reports

This rule reports selected negated patterns in conditions and top-level logical expressions, including `!foo` and `foo !== bar` forms.

## Why this rule exists

Negated conditions can increase cognitive load, especially in compound boolean
expressions. Positive predicates are usually easier to scan and reason about.

## ❌ Incorrect

```ts
if (!x && y) {
}
if (x !== 1 && y) {
}
const value = !x || y;
```

## ✅ Correct

```ts
if (x && y) {
}
if (x === 1 && y) {
}
const value = x && y;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migrations typically involve flipping comparisons (`!==` → `===`) and
restructuring condition branches for positive checks.

### Options

This rule has no options.

## Additional examples

```ts
if (!isReady || hasError) {
 return;
}
// ❌ reported

if (isReady && hasNoError) {
 start();
}
// ✅ valid when predicates are already positive.
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-negated-conditions": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally allows negated condition forms.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R048

## Further reading

- [ESLint: `no-negated-condition`](https://eslint.org/docs/latest/rules/no-negated-condition)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
