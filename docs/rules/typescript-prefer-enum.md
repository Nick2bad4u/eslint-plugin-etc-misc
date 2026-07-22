# typescript/prefer-enum

Prefer enums over string literal comparisons and unions.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Replacement:** None.

This policy contradicts the plugin's `no-enum` rule and is not recommended as a
general TypeScript default. Projects that deliberately retain enums may also
consider the related
[`@typescript-eslint/no-unsafe-enum-comparison`](https://typescript-eslint.io/rules/no-unsafe-enum-comparison/)
rule, but it does not replace this rule's behavior.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule reports three patterns:

- string literal comparisons against enum-like expressions,
- string literal `return` values from enum-like return contexts,
- type aliases that are pure unions of multiple string literals.

## What this rule reports

This rule reports opportunities to replace string-literal-based state modeling
with enum members.

## Why this rule exists

Enums centralize allowed values and reduce drift between string literals spread
across comparisons, returns, and type unions.

## ❌ Incorrect

```ts
type Status = "open" | "closed";
// ❌ reported (pure string-literal union)
```

## ✅ Correct

```ts
enum Status {
 Open = "open",
 Closed = "closed",
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Because it uses type analysis for enum-like checks, ensure parser services are
enabled in lint configuration.

### Options

This rule has no options.

## Additional examples

```ts
enum Status {
 Open = "open",
 Closed = "closed",
}

const getStatus = (): Status => {
 return "open";
};
// ❌ reported (string literal return in enum-like return context)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/prefer-enum": "error",
  },
 },
];
```

## When not to use it

Disable this rule if string literal unions are preferred over enums in your
project's type design.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R132

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
