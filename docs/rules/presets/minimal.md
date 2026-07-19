---
title: Minimal preset
---

# 🟢 Minimal

Use this preset when you want the `recommended` baseline without the
`typescript/prefer-readonly*` rules.

## Config key

```ts
etcMisc.configs.minimal;
```

## Flat Config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.minimal];
```

## Rules in this preset

- [`etc-misc/consistent-optional-props`](../consistent-optional-props.md) (R008)
- [`etc-misc/no-assign-mutated-array`](../no-assign-mutated-array.md) (R016)
- [`etc-misc/no-const-enum`](../no-const-enum.md) (R021)
- [`etc-misc/no-function-declare-after-return`](../no-function-declare-after-return.md) (R026)
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R027)
- [`etc-misc/no-internal`](../no-internal.md) (R029)
- [`etc-misc/no-t`](../no-t.md) (R044)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R046)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R047)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R048)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R049)
- [`etc-misc/no-vulnerable`](../no-vulnerable.md) (R054)
- [`etc-misc/throw-error`](../throw-error.md) (R077)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R088)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R119)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R133)

## Adoption guidance

Start here if you want a pragmatic baseline before adopting readonly-style
constraints from `recommended`.
