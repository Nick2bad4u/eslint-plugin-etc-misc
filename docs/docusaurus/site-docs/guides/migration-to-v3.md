---
sidebar_position: 2
title: Migration to v3
---

# Migration to v3

Version 3 changes the exhaustive preset contract so normal presets never
enable deprecated rules implicitly.

## Exhaustive preset changes

- `etcMisc.configs.all` now enables every non-deprecated rule with
  metadata-derived severities.
- `etcMisc.configs.allStrict` now enables every non-deprecated rule at `error`.
- `etcMisc.configs.allWithDeprecated` adds externally replaced or otherwise
  non-duplicated deprecated rules to `all` at warning severity.
- `etcMisc.configs.allStrictWithDeprecated` adds the same migration-only rules
  to `allStrict` at warning severity.

The deprecated-inclusive presets still omit deprecated rules with same-plugin
replacements so overlapping implementations never execute together.

Deprecated rules remain exported in v3 for explicit migration use and advertise
v4.0.0 as their likely removal version.

## Migration

Most projects should keep their existing `all` or `allStrict` selection and
accept the removal of deprecated diagnostics. If a staged migration requires
the old behavior, temporarily switch to the matching deprecated-inclusive
preset:

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.allWithDeprecated];
```

Remove deprecated rule violations and then return to `all` or `allStrict`.

## Rule ownership changes

Version 3 narrows this package to rules that provide distinct behavior. The
following maintained projects now own behavior that was duplicated here:

| Deprecated rule family                                    | Replacement                                                                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `default-case`, `no-writeonly`                            | ESLint core `default-case`, `accessor-pairs`                                                |
| `consistent-empty-lines`                                  | `@stylistic/no-multiple-empty-lines`                                                        |
| Array, object, export, and interface-member sorting rules | Perfectionist and `@typescript-eslint/member-ordering`                                      |
| `no-implicit-any-catch`                                   | `@typescript-eslint/use-unknown-in-catch-callback-variable`                                 |
| `no-misused-generics`                                     | `@typescript-eslint/no-unnecessary-type-parameters`                                         |
| `throw-error`                                             | `@typescript-eslint/only-throw-error` and `@typescript-eslint/prefer-promise-reject-errors` |
| `no-unnecessary-template-literal`                         | `unicorn/no-useless-template-literals`                                                      |
| `restrict-identifier-characters`, `no-underscore-export`  | ESLint core `id-match`, `no-restricted-exports`                                             |
| `typescript/no-complex-return-type`                       | `@typescript-eslint/explicit-function-return-type`                                          |

The four `jsx-no-*-as-prop` rules are replaced by the broader local
`no-unstable-react-values` rule. It remains opt-in because React Compiler makes
blanket identity-stability linting a poor general default.

## Readonly rule ownership

Use `@typescript-eslint/prefer-readonly` for mutation-aware private class
state and `@typescript-eslint/prefer-readonly-parameter-types` for deep
parameter analysis. When migrating existing annotations, enable
`checkParameterProperties`, set `ignoreInferredTypes` according to the desired
strictness, and set `treatMethodsAsReadonly: true` when `ReadonlyMap` and
`ReadonlySet` should satisfy the policy.

The plugin retains its non-parameter collection rules for property, return,
and type-alias annotations, plus `typescript/prefer-readonly-index-signature`.
The broad collection rules and parameter-only rules are deprecated because
they overlapped those retained rules and typescript-eslint.

## Correctness changes

- `no-unnecessary-initialization` no longer reports `const` declarations,
  because removing a `const` initializer creates invalid JavaScript.
- Deprecated `no-unnecessary-template-literal` ignores tagged templates so its
  fixer cannot change tagged-template syntax into invalid code.
- Deprecated `typescript/define-function-in-one-statement` reports only direct
  property assignments on locally declared function values instead of every
  member assignment.
- `typescript/prefer-enum` is deprecated because it contradicted `no-enum` in
  exhaustive presets.

## Verification

Inspect the effective flat config and run the repository lint suite after
upgrading:

```bash
npx eslint --print-config path/to/file.js
npx eslint .
```
