# no-restricted-syntax

Disallow syntax matched by configured AST selectors.

## Targeted pattern scope

This rule reports any AST node matched by configured selector entries.

Each entry can be:

- a selector string, or
- an object with `selector` and optional custom `message`.

## What this rule reports

This rule reports nodes selected by any configured selector in `selectors`.

## Why this rule exists

It provides a general escape hatch for enforcing project-specific syntax bans.

## ❌ Incorrect

```ts
if (x) {
 y();
}
```

with options:

```ts
{
 selectors: ["IfStatement"];
}
```

## ✅ Correct

```ts
for (;;) {
 break;
}
```

with options:

```ts
{
 selectors: ["IfStatement"];
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax)

## Behavior and migration notes

This rule is deprecated in favor of ESLint core `no-restricted-syntax`.

It reports only and does not provide an autofix.

### Options

```ts
type Options = [
 {
  selectors?: Array<
   | string
   | {
      message?: string;
      selector: string;
     }
  >;
 },
];
```

### Default configuration

```ts
[{ selectors: [] }];
```

With the default empty selector list, this rule does not report anything until
you configure selectors.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
// config:
// {
//   selectors: [
//     { selector: "CallExpression[callee.name='setTimeout']", message: "Use scheduler API" }
//   ]
// }
setTimeout(() => {}, 1000);
// ❌ reported with custom message
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-restricted-syntax": ["error", { selectors: ["IfStatement"] }],
  },
 },
];
```

## When not to use it

Disable this rule if your project does not rely on selector-based syntax restrictions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R037

## Further reading

- [ESLint core: no-restricted-syntax](https://eslint.org/docs/latest/rules/no-restricted-syntax)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
