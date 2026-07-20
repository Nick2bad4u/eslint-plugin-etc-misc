# no-explicit-type-exports

Require type-only exports to use explicit `type` syntax.

## Targeted pattern scope

This adapter targets export declarations whose local bindings resolve only to
TypeScript types.

## What this rule reports

It reports type-only bindings exported with value-export syntax.

## Why this rule exists

Explicit type exports make module intent clear and allow transpilers to erase
type-only edges reliably.

## ❌ Incorrect

```ts
interface Props {
 label: string;
}

export { Props };
```

## ✅ Correct

```ts
interface Props {
 label: string;
}

export type { Props };
```

## Deprecated

- **Deprecated since:** `v1.3.0`
- **Use instead:**
  [`@typescript-eslint/consistent-type-exports`](https://typescript-eslint.io/rules/consistent-type-exports)

This rule is a compatibility adapter for the maintained typescript-eslint rule.
New configurations should enable the upstream rule directly.

## Behavior and migration notes

### Options

The adapter preserves the upstream option:

```ts
type Options = [{ fixMixedExportsWithInlineTypeSpecifier?: boolean }];
```

When `fixMixedExportsWithInlineTypeSpecifier` is `false` (the default), a mixed
export is split into value and type export declarations. When it is `true`, the
fix uses inline type specifiers such as `export { type Props, value }`.

The adapter intentionally does not reproduce the old plugin's filesystem-based
module inspection or import rewriting. It uses TypeScript's program information
through the maintained upstream implementation.

## ESLint flat config example

```ts
import tseslint from "typescript-eslint";

export default [
 ...tseslint.configs.recommendedTypeChecked,
 {
  rules: {
   "@typescript-eslint/consistent-type-exports": "error",
  },
 },
];
```

## When not to use it

Do not enable this deprecated adapter in new configurations. The replacement
requires type-aware linting, so exclude files that are not part of the configured
TypeScript project.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R036

## Further reading

- [`@typescript-eslint/consistent-type-exports`](https://typescript-eslint.io/rules/consistent-type-exports)
- [`eslint-plugin-no-explicit-type-exports`](https://github.com/intuit/eslint-plugin-no-explicit-type-exports)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
