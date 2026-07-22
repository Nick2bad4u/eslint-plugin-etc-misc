---
title: Recommended preset
---

# 🟡 Recommended

Use this preset as the default onboarding path for most projects.

## Config key

```ts
etcMisc.configs.recommended;
```

## Flat Config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.recommended];
```

## Rules in this preset

- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R009)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R022)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R027)
- [`etc-misc/no-function-declare-after-return`](../no-function-declare-after-return.md) (R039)
- [`etc-misc/no-internal`](../no-internal.md) (R042)
- [`etc-misc/no-t`](../no-t.md) (R059)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R061)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R062)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R063)
- [`etc-misc/no-vulnerable`](../no-vulnerable.md) (R071)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R112)
- [`etc-misc/typescript/prefer-readonly-index-signature`](../typescript-prefer-readonly-index-signature.md) (R136)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R143)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R157)

## Adoption guidance

If you don't want readonly preference rules yet, start with minimal. Otherwise, start here for a balanced baseline of correctness and maintainability rules. This preset is designed to be a long-term baseline, so it includes some rules that may be initially noisy but are worth fixing early for long-term benefits.

This preset now enables a wider "safe baseline" mix:

- strong correctness rules as `error`
- low-risk style/maintainability rules as `warn`

Start with this preset, then promote selected `warn` rules to `error` as your
codebase stabilizes.
