# typescript/no-restricted-syntax

Disallow syntax using selector rules with optional type-group filters.

## Targeted pattern scope

This rule is a TypeScript-prefixed alias of the plugin's
`no-restricted-syntax` rule.

It reports nodes that match configured AST selectors.

## What this rule reports

This rule reports selector matches using either:

- a default message (`Disallowed syntax.`), or
- a custom per-selector message when configured.

## Why this rule exists

Selector-based restrictions let teams ban precise syntax shapes without writing
custom rules.

## ❌ Incorrect

```ts
// config: { selectors: ["WithStatement"] }
with (obj) {
 doWork();
}
```

## ✅ Correct

```ts
// config: { selectors: ["WithStatement"] }
doWork();
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-restricted-syntax`](https://typescript-eslint.io/rules/no-restricted-syntax)

## Behavior and migration notes

This rule is deprecated in favor of
`@typescript-eslint/no-restricted-syntax`.

It reports only and does not provide an autofix.

### Options

```ts
type Options = [
 {
  selectors?: Array<string | { message?: string; selector: string }>;
 },
];
```

Default:

```json
{ "selectors": [] }
```

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
// config
// {
//   selectors: [
//     { selector: "CallExpression[callee.name='eval']", message: "Avoid eval." }
//   ]
// }
eval("2 + 2");
// ❌ reported with custom message
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-restricted-syntax": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project does not rely on selector-driven syntax bans.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R103

## Further reading

- [@typescript-eslint/no-restricted-syntax](https://typescript-eslint.io/rules/no-restricted-syntax)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
