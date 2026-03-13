---
title: Getting Started
description: Enable eslint-plugin-etc-misc quickly in Flat Config.
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-etc-misc typescript
```

Enable one preset in your Flat Config:

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    etcMisc.configs.recommended,
];
```

Use `recommended` first, then promote to `all` when you want comprehensive
coverage.

## Alternative: manual scoped setup

If you prefer to apply plugin rules inside your own file-scoped config object, spread the preset rules manually.

```ts
import tsParser from "@typescript-eslint/parser";
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                // Enable only when using a type-aware preset.
                // projectService: true,
                sourceType: "module",
            },
        },
        plugins: {
            "etc-misc": etcMisc,
        },
        rules: {
            ...etcMisc.configs.recommended.rules,
        },
    },
];
```

Use this pattern when you only extend rules and want full control over parser setup per scope.

## Recommended rollout

1. Start with `recommended`.
2. Fix violations in small batches.
3. Move to `all` when your baseline is stable and you want complete coverage.

See the **Presets** section in this sidebar for details and examples.
