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

- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R008)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R016)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R021)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R026)
- [`etc-misc/no-internal`](../no-internal.md) (R028)
- [`etc-misc/no-t`](../no-t.md) (R043)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R045)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R046)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R047)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R048)
- [`etc-misc/throw-error`](../throw-error.md) (R074)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R085)
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

If you don’t want readonly preference rules yet, start with minimal. Otherwise, start here for a balanced baseline of correctness and maintainability rules. This preset is designed to be a long-term baseline, so it includes some rules that may be initially noisy but are worth fixing early for long-term benefits.

This preset now enables a wider "safe baseline" mix:

- strong correctness rules as `error`
- low-risk style/maintainability rules as `warn`

Start with this preset, then promote selected `warn` rules to `error` as your
codebase stabilizes.
