---
title: Strict Type-Checked preset
---

# 🔵 Strict Type-Checked

Use this preset when you want strict linting plus additional non-deprecated
rules that require TypeScript type information.

## Config key

```ts
etcMisc.configs.strictTypeChecked;
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
- [`etc-misc/no-function-declare-after-return`](../no-function-declare-after-return.md) (R026)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R027)
- [`etc-misc/no-internal`](../no-internal.md) (R029)
- [`etc-misc/no-misused-generics`](../no-misused-generics.md) (R032)
- [`etc-misc/no-t`](../no-t.md) (R044)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R046)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R047)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R048)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R049)
- [`etc-misc/no-vulnerable`](../no-vulnerable.md) (R054)
- [`etc-misc/throw-error`](../throw-error.md) (R077)
- [`etc-misc/typescript/array-callback-return-type`](../typescript-array-callback-return-type.md) (R083)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R088)
- [`etc-misc/typescript/no-never`](../typescript-no-never.md) (R094)
- [`etc-misc/typescript/no-unsafe-object-assign`](../typescript-no-unsafe-object-assign.md) (R104)
- [`etc-misc/typescript/prefer-enum`](../typescript-prefer-enum.md) (R108)
- [`etc-misc/typescript/prefer-readonly-array-parameter`](../typescript-prefer-readonly-array-parameter.md) (R111)
- [`etc-misc/typescript/prefer-readonly-array`](../typescript-prefer-readonly-array.md) (R110)
- [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R112)
- [`etc-misc/typescript/prefer-readonly-map`](../typescript-prefer-readonly-map.md) (R113)
- [`etc-misc/typescript/prefer-readonly-property`](../typescript-prefer-readonly-property.md) (R114)
- [`etc-misc/typescript/prefer-readonly-record`](../typescript-prefer-readonly-record.md) (R115)
- [`etc-misc/typescript/prefer-readonly-set`](../typescript-prefer-readonly-set.md) (R116)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R119)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R133)

## Adoption guidance

Adopt this preset when your project is fully type-aware and you want stronger
semantic enforcement before moving to all-rule coverage.
