---
title: Recommended preset
---

# 🟡 Recommended

Use this preset as the default onboarding path for most projects.

## Config key

```ts
etcMisc.configs.recommended
```

## Flat Config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.recommended];
```

## Rules in this preset

- ⚠️ `warn`: [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R008)
- ⛔ `error`: [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R016)
- ⚠️ `warn`: [`etc-misc/no-const-enum`](../no-const-enum.md) (R021)
- ⛔ `error`: [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R026)
- ⛔ `error`: [`etc-misc/no-internal`](../no-internal.md) (R028)
- ⛔ `error`: [`etc-misc/no-t`](../no-t.md) (R043)
- ⚠️ `warn`: [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R045)
- ⚠️ `warn`: [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R046)
- ⚠️ `warn`: [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R047)
- ⚠️ `warn`: [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R048)
- ⛔ `error`: [`etc-misc/throw-error`](../throw-error.md) (R074)
- ⛔ `error`: [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R085)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-array`](../typescript-prefer-readonly-array.md) (R098)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-array-parameter`](../typescript-prefer-readonly-array-parameter.md) (R099)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R100)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-map`](../typescript-prefer-readonly-map.md) (R101)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-property`](../typescript-prefer-readonly-property.md) (R102)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-record`](../typescript-prefer-readonly-record.md) (R103)
- ⚠️ `warn`: [`etc-misc/typescript/prefer-readonly-set`](../typescript-prefer-readonly-set.md) (R104)
- ⚠️ `warn`: [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R106)
- ⚠️ `warn`: [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R115)

## Adoption guidance

This preset now enables a wider "safe baseline" mix:

- strong correctness rules as `error`
- low-risk style/maintainability rules as `warn`

Start with this preset, then promote selected `warn` rules to `error` as your
codebase stabilizes.
