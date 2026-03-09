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

- `etc-misc/no-assign-mutated-array`
- `etc-misc/no-implicit-any-catch`
- `etc-misc/no-internal`
- `etc-misc/no-t`

## Adoption guidance

This preset is intentionally small and practical. Start here, fix violations,
then move to `etcMisc.configs.all` when you want full rule coverage.
