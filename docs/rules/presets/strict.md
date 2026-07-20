---
title: Strict preset
---

# 🟠 Strict

Use this preset when you want the `recommended` rule set with stricter
enforcement.

## Config key

```ts
etcMisc.configs.strict;
```

## Flat Config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.strict];
```

## Rules in this preset

- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R009)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R022)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R027)
- [`etc-misc/no-function-declare-after-return`](../no-function-declare-after-return.md) (R039)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R040)
- [`etc-misc/no-internal`](../no-internal.md) (R042)
- [`etc-misc/no-t`](../no-t.md) (R059)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R061)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R062)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R063)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R064)
- [`etc-misc/no-vulnerable`](../no-vulnerable.md) (R071)
- [`etc-misc/throw-error`](../throw-error.md) (R100)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R112)
- [`etc-misc/typescript/prefer-readonly-array-parameter`](../typescript-prefer-readonly-array-parameter.md) (R135)
- [`etc-misc/typescript/prefer-readonly-array`](../typescript-prefer-readonly-array.md) (R134)
- [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R136)
- [`etc-misc/typescript/prefer-readonly-map`](../typescript-prefer-readonly-map.md) (R137)
- [`etc-misc/typescript/prefer-readonly-property`](../typescript-prefer-readonly-property.md) (R138)
- [`etc-misc/typescript/prefer-readonly-record`](../typescript-prefer-readonly-record.md) (R139)
- [`etc-misc/typescript/prefer-readonly-set`](../typescript-prefer-readonly-set.md) (R140)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R143)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R157)

## Adoption guidance

Start here after your team is stable on `recommended` and ready to fail CI on the
same baseline rule set.
