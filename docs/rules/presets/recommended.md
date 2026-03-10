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

## Adoption guidance

This preset is intentionally small and practical. Start here, fix violations,
then move to `etcMisc.configs.all` when you want full rule coverage.
