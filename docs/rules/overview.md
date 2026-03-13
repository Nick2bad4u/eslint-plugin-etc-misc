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

| Preset                        | Purpose                                       |
| ----------------------------- | --------------------------------------------- |
| 🟡 `etcMisc.configs.recommended` | Balanced starter preset for most projects.    |
| 🟣 `etcMisc.configs.all`         | Enables every rule exported by the plugin.    |

## Next steps

- Open **Getting Started** in this sidebar.
- Browse **Presets** for preset-by-preset guidance.
- Use **Rules** to review every rule with examples.
