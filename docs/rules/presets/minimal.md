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
- [`etc-misc/no-implicit-any-catch`](../no-implicit-any-catch.md) (R026)
- [`etc-misc/no-internal`](../no-internal.md) (R028)
- [`etc-misc/no-t`](../no-t.md) (R043)
- [`etc-misc/no-unnecessary-as-const`](../no-unnecessary-as-const.md) (R045)
- [`etc-misc/no-unnecessary-break`](../no-unnecessary-break.md) (R046)
- [`etc-misc/no-unnecessary-initialization`](../no-unnecessary-initialization.md) (R047)
- [`etc-misc/no-unnecessary-template-literal`](../no-unnecessary-template-literal.md) (R048)
- [`etc-misc/throw-error`](../throw-error.md) (R074)
- [`etc-misc/typescript/no-boolean-literal-type`](../typescript-no-boolean-literal-type.md) (R085)
- [`etc-misc/typescript/require-readonly-array-return-type`](../typescript-require-readonly-array-return-type.md) (R116)
- [`etc-misc/typescript/require-this-void`](../typescript-require-this-void.md) (R130)

## Adoption guidance

Start here if you want a pragmatic baseline before adopting readonly-style
constraints from `recommended`.
