# typescript/no-empty-interfaces

Disallow empty interfaces without `extends` clauses.

## Targeted pattern scope

This rule targets interface declarations where:

- `body.body.length === 0` (no members), and
- `extends.length === 0` (no base interfaces).

## What this rule reports

This rule reports interfaces that declare no members and no base interfaces.

## Why this rule exists

An empty interface with no inheritance usually adds no type information and can
often be replaced by a more explicit construct.

## ❌ Incorrect

```ts
interface I {}
```

## ✅ Correct

```ts
interface I {
 value: string;
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-empty-object-type`](https://typescript-eslint.io/rules/no-empty-object-type)

## Behavior and migration notes

This rule is deprecated in favor of
`@typescript-eslint/no-empty-object-type`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
interface Marker extends Base {}
// ✅ valid: extends is present

interface Empty {}
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-empty-interfaces": "error",
  },
 },
];
```

## When not to use it

Disable this rule if marker interfaces are intentionally used in your project.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R088

## Further reading

- [@typescript-eslint/no-empty-object-type](https://typescript-eslint.io/rules/no-empty-object-type)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
