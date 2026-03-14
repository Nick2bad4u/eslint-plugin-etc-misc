---
title: Strict Type-Checked preset
---

# 🔵 Strict Type-Checked

Use this preset when you want strict linting plus additional non-deprecated
rules that require TypeScript type information.

## Config key

```ts
etcMisc.configs.strictTypeChecked
```

## Flat Config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.strictTypeChecked];
```

## Type information requirement

⚠️ This preset is type-aware and includes
`languageOptions.parserOptions.projectService: true`.

If your project uses custom parser options, merge this preset with your own
`languageOptions` so full type information remains available.

## Rules in this preset

- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R008)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R016)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R021)
- [`etc-misc/no-foreach`](../no-foreach.md) (R025)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R026)
- [`etc-misc/no-internal`](../no-internal.md) (R028)
- [`etc-misc/no-misused-generics`](../no-misused-generics.md) (R031)
- [`etc-misc/no-t`](../no-t.md) (R043)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R045)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R046)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R047)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R048)
- [`etc-misc/throw-error`](../throw-error.md) (R074)
- [`etc-misc/typescript/array-callback-return-type`](../typescript-array-callback-return-type.md) (R080)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R085)
- [`etc-misc/typescript/no-never`](../typescript-no-never.md) (R091)
- [`etc-misc/typescript/no-unsafe-object-assign`](../typescript-no-unsafe-object-assign.md) (R101)
- [`etc-misc/typescript/no-unsafe-object-assignment`](../typescript-no-unsafe-object-assignment.md) (R102)
- [`etc-misc/typescript/prefer-enum`](../typescript-prefer-enum.md) (R105)
- [`etc-misc/typescript/prefer-readonly-array-parameter`](../typescript-prefer-readonly-array-parameter.md) (R108)
- [`etc-misc/typescript/prefer-readonly-array`](../typescript-prefer-readonly-array.md) (R107)
- [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R109)
- [`etc-misc/typescript/prefer-readonly-map`](../typescript-prefer-readonly-map.md) (R110)
- [`etc-misc/typescript/prefer-readonly-property`](../typescript-prefer-readonly-property.md) (R111)
- [`etc-misc/typescript/prefer-readonly-record`](../typescript-prefer-readonly-record.md) (R112)
- [`etc-misc/typescript/prefer-readonly-set`](../typescript-prefer-readonly-set.md) (R113)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R116)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R130)

## Adoption guidance

Adopt this preset when your project is fully type-aware and you want stronger
semantic enforcement before moving to all-rule coverage.
