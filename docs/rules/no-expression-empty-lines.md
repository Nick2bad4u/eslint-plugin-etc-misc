# no-expression-empty-lines

Disallow blank lines inside expression statements.

## Targeted pattern scope

This rule inspects `ExpressionStatement` nodes and checks the expression’s raw
source text for blank lines.

It only applies to expression statements and does not inspect declarations,
blocks, or other statement kinds.

## What this rule reports

This rule reports expression statements whose inner source text contains empty lines and auto-fixes by removing those empty lines.

## Why this rule exists

Blank lines _inside_ a single expression usually come from accidental edits and
make statement boundaries harder to read. Normalizing these expressions reduces
formatting noise.

## ❌ Incorrect

```ts
someCall(1);
```

## ✅ Correct

```ts
someCall(1);
```

## Behavior and migration notes

This rule is autofixable.

The fixer removes blank lines inside the expression, trims trailing spaces on
each line, and rewrites the statement with a terminating semicolon.

### Options

This rule has no options.

## Additional examples

```ts
doWork(
 value,

 nextValue
);
// ❌ reported

doWork(value, nextValue);
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-expression-empty-lines": "error",
  },
 },
];
```

## When not to use it

Disable this rule if blank lines inside expressions are allowed for readability.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R024

## Further reading

- [ESLint: `no-multiple-empty-lines`](https://eslint.org/docs/latest/rules/no-multiple-empty-lines)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
