# typescript/exhaustive-switch

Require a default branch in switch statements with multiple cases.

## Targeted pattern scope

This rule targets `SwitchStatement` nodes that:

- have more than one case branch, and
- have no `default` branch.

## What this rule reports

This rule reports non-trivial switch statements that have no `default` case.

## Why this rule exists

A required `default` branch reduces accidental non-exhaustive control flow.

## ❌ Incorrect

```ts
switch (x) {
 case 1:
  break;
 case 2:
  break;
}
```

## ✅ Correct

```ts
switch (x) {
 case 1:
  break;
 default:
  break;
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`@typescript-eslint/switch-exhaustiveness-check`](https://typescript-eslint.io/rules/switch-exhaustiveness-check)

## Behavior and migration notes

This rule is deprecated in favor of
`@typescript-eslint/switch-exhaustiveness-check`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
switch (status) {
 case "ready":
  return 1;
}
// ✅ valid (single branch switch is outside this rule)

switch (status) {
 case "ready":
  return 1;
 case "done":
  return 2;
}
// ❌ reported: multiple branches and no default
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/exhaustive-switch": "error",
  },
 },
];
```

## When not to use it

Disable this rule if you intentionally omit `default` cases.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R111

## Further reading

- [@typescript-eslint/switch-exhaustiveness-check](https://typescript-eslint.io/rules/switch-exhaustiveness-check)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
