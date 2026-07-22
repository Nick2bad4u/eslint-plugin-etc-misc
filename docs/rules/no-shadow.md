# no-shadow

Disallow shadowing variables from outer scopes.

## Targeted pattern scope

This rule walks lexical scopes and reports variable declarations that reuse
names from parent scopes.

Enum declarations are intentionally ignored.

## What this rule reports

This rule reports variables that reuse names from outer scopes.

Enum declarations are skipped both when evaluating the current declaration and
when evaluating potential outer-scope matches.

## Why this rule exists

Shadowing can hide outer bindings and make data flow harder to reason about.

## ❌ Incorrect

```ts
const x = 1;
function f() {
 const x = 2;
 return x;
}
```

## ✅ Correct

```ts
const x = 1;
function f() {
 const y = x + 1;
 return y;
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`@typescript-eslint/no-shadow`](https://typescript-eslint.io/rules/no-shadow)

## Behavior and migration notes

This rule is deprecated in favor of `@typescript-eslint/no-shadow`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
enum Status {
 Ready,
}

function run(Status: number): number {
 return Status;
}
// enum-related declarations are intentionally ignored by this rule.
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-shadow": "error",
  },
 },
];
```

## When not to use it

Disable this rule if shadowed variable names are acceptable in your code style.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R056

## Further reading

- [@typescript-eslint/no-shadow](https://typescript-eslint.io/rules/no-shadow)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
