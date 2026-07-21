---
sidebar_position: 2
title: Migrating to v2
---

# Migrating to v2

Version 2 removes rule adapters that executed implementations from other ESLint
plugins. Configure the upstream rule directly when you still want that
behavior.

## Removed adapter rules

| Removed `etc-misc/*` rule    | Configure instead                                     |
| ---------------------------- | ----------------------------------------------------- |
| `array-type`                 | `@typescript-eslint/array-type`                       |
| `compat`                     | `compat/compat`                                       |
| `typescript/compat`          | `compat/compat`                                       |
| `no-explicit-type-exports`   | `@typescript-eslint/consistent-type-exports`          |
| `no-mixed-enums`             | `@typescript-eslint/no-mixed-enums`                   |
| `no-secret`                  | `no-secrets/no-secrets`                               |
| `no-unused-disable`          | `@eslint-community/eslint-comments/no-unused-disable` |
| `no-unused-imports`          | `unused-imports/no-unused-imports`                    |
| `no-unused-vars`             | `unused-imports/no-unused-vars`                       |
| `no-useless-generics`        | `@typescript-eslint/no-unnecessary-type-parameters`   |
| `no-value-tostring`          | `@typescript-eslint/no-base-to-string`                |
| `prefer-includes`            | `unicorn/prefer-includes`                             |
| `sort-exports`               | `simple-import-sort/exports`                          |
| `sort-imports`               | `simple-import-sort/imports`                          |
| `throw-new-error`            | `unicorn/throw-new-error`                             |
| `unused-internal-properties` | `unicorn/no-unused-properties`                        |
| `uppercase-iife`             | `unicorn/no-unreadable-iife`                          |
| `words`                      | `write-good-comments/write-good-comments`             |

The corresponding upstream plugins are no longer runtime dependencies of
`eslint-plugin-etc-misc`.

## React stability rule names

Use `no-unstable-react-values` instead of `require-usememo`, and use
`no-unstable-react-children` instead of `require-usememo-children`. The old
IDs remain deprecated compatibility aliases through 3.0.0 and are excluded from
presets to prevent duplicate reports.

`require-memo` is deprecated through 3.0.0 with no replacement. React Compiler
already performs memo-like optimization, and manual memoization should be driven
by profiling rather than a blanket lint requirement.

## Changed defaults

- `no-invalid-jsx-nesting` now defaults `checkVoidParents` to `false`.
  Use `@eslint-react/dom-no-void-elements-with-children` for complete void
  element coverage, or set this option to `true` to restore the prior check.
- The four `jsx-no-*-as-prop` rules now ignore every intrinsic element by
  default. Set `nativeAllowList: []` to opt back into checking all intrinsic
  attributes.
- `no-only-tests` now detects focus segments anywhere in supported framework
  chains, follows imports and aliases, respects shadowed bindings, and treats
  `fit` and `fdescribe` as focused by default.

## Validation

After upgrading, search for removed IDs and run ESLint against the effective
flat config:

```bash
npx eslint .
```

If you use `all` or `all-strict`, inspect the changed rule inventory before
promoting the upgrade.
