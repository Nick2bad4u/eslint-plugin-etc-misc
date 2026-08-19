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

export default [etcMisc.configs.recommended];
```

Every exported preset is scoped to JavaScript and TypeScript file extensions,
so it can be composed safely with ESLint language plugins for JSON, CSS, or
other non-JavaScript languages.

Use `minimal` or `recommended` first, then move through stricter presets as
your baseline stabilizes.

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

1. Start with `minimal` if you want to defer the `typescript/prefer-readonly*` rules.
2. Move to `recommended` for the full baseline.
3. Promote to `strict` when you want the same rules to hard-fail.
4. Move to `strictTypeChecked` once your lint config is fully type-aware.
5. Adopt `allStrict` or `all` when you want every non-deprecated rule.

Use `allStrictWithDeprecated` or `allWithDeprecated` only as temporary
migration presets when an existing configuration still needs deprecated rules.

Deprecated rules with same-plugin replacements remain available for explicit
legacy configurations but are intentionally excluded from every preset.

See the **Presets** section in this sidebar for details and examples.
