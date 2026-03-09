---
sidebar_position: 2
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-etc-misc
```

Then enable it in your Flat Config:

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    etcMisc.configs.recommended,
];
```

## Recommended approach

- Start with `etcMisc.configs.recommended`.
- Fix violations in small batches.
- Move to `etcMisc.configs.all` when you want every available rule enabled.

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs synced from the repository.
