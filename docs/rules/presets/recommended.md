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

- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R016)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R026)
- [`etc-misc/no-internal`](../no-internal.md) (R028)
- [`etc-misc/no-t`](../no-t.md) (R043)
- [`etc-misc/throw-error`](../throw-error.md) (R074)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R085)

## Adoption guidance

This preset now enables a wider "safe baseline" mix:

- strong correctness rules as `error`
- low-risk style/maintainability rules as `warn`

Start with this preset, then promote selected `warn` rules to `error` as your
codebase stabilizes.
