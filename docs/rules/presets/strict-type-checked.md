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

- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R009)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R022)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R027)
- [`etc-misc/no-foreach`](../no-foreach.md) (R038)
- [`etc-misc/no-function-declare-after-return`](../no-function-declare-after-return.md) (R039)
- [`etc-misc/no-internal`](../no-internal.md) (R042)
- [`etc-misc/no-t`](../no-t.md) (R059)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R061)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R062)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R063)
- [`etc-misc/no-vulnerable`](../no-vulnerable.md) (R071)
- [`etc-misc/typescript/array-callback-return-type`](../typescript-array-callback-return-type.md) (R106)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R112)
- [`etc-misc/typescript/no-never`](../typescript-no-never.md) (R118)
- [`etc-misc/typescript/no-unsafe-object-assign`](../typescript-no-unsafe-object-assign.md) (R128)
- [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R136)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R143)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R157)

## Adoption guidance

Adopt this preset when your project is fully type-aware and you want stronger
semantic enforcement before moving to all-rule coverage.
