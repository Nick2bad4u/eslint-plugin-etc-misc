---
title: Overview
description: Overview of eslint-plugin-etc-misc rule docs and presets.
---

# eslint-plugin-etc-misc

`eslint-plugin-etc-misc` combines rules from `eslint-plugin-etc` and
`eslint-plugin-misc` into one plugin for TypeScript-first codebases.

This docs section focuses on the rule reference under `docs/rules/` and the
flat-config presets exported by this repository.

## Installation

```bash
npm install --save-dev eslint-plugin-etc-misc typescript
```

> `@typescript-eslint/parser` is loaded automatically by the plugin presets.

## Quick start (Flat Config)

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [etcMisc.configs.recommended];
```

That is enough for TypeScript files (`**/*.{ts,tsx,mts,cts}`).

## Presets

| Preset                                 | Purpose                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------- |
| 🟢 `etcMisc.configs.minimal`           | `recommended` minus the `typescript/prefer-readonly*` rules.              |
| 🟡 `etcMisc.configs.recommended`       | Balanced starter preset for most projects.                                |
| 🟠 `etcMisc.configs.strict`            | Same rule set as `recommended`, but every enabled rule is `error`.        |
| 🔵 `etcMisc.configs.strictTypeChecked` | `strict` plus additional non-deprecated type-aware rules at `error`.      |
| 🔴 `etcMisc.configs.allStrict`         | Every preset-eligible rule at `error`; external deprecations stay `warn`. |
| 🟣 `etcMisc.configs.all`               | Every preset-eligible rule with metadata-derived severities.              |

Deprecated same-plugin compatibility aliases remain exported for manual
configuration but are excluded from executable presets to avoid running the
same implementation twice.

## Next steps

- Open **Getting Started** in this sidebar.
- Browse **Presets** for preset-by-preset guidance.
- Use **Rules** to review every rule with examples.
