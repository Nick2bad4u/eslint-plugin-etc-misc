# consistent-import

Enforce consistent import declaration style.

## Targeted pattern scope

This rule analyzes `ImportDeclaration` nodes and compares import specifier shape
for each module source string.

It distinguishes five styles:

- `side-effect`: `import "x";`
- `default`: `import x from "x";`
- `named`: `import { x } from "x";`
- `mixed`: `import x, { y } from "x";`
- `namespace`: `import * as x from "x";`

## What this rule reports

This rule reports imports whose style does not match the expected style.

- Without options, the first import style seen for a given module source becomes
  the expected style for subsequent imports from that same source.
- With `style`, all imports must match the configured style globally.

## Why this rule exists

Mixing import styles for the same module creates unnecessary visual noise and can
hide duplicate or redundant imports. A consistent style improves readability and
keeps import blocks predictable.

## ❌ Incorrect

```ts
import fs from "node:fs";
import { readFileSync } from "node:fs";
//                      ^^^^^^^^^^^^^^ second import style differs for same source
```

## ✅ Correct

```ts
import fs from "node:fs";
import path from "node:path";
```

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
```

## Behavior and migration notes

This rule has no autofix because changing import style can require coordinated
identifier updates.

Adopt safely by selecting one preferred style and applying codemods (or manual
cleanup) before promoting from `warn` to `error`.

### Options

```ts
type Options = [
 {
  style?: "default" | "mixed" | "named" | "namespace" | "side-effect";
 },
];
```

- `style` (optional): enforce one style for all import declarations.

### Default configuration

```ts
[{}];
```

When `style` is omitted, the first seen import style for each module source is
treated as that source's expected style.

Example:

```ts
"etc-misc/consistent-import": ["error", { style: "named" }];
```

## Additional examples

```ts
import "reflect-metadata";
import "reflect-metadata";
// Consistent side-effect style for the same source.
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/consistent-import": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally mixes import styles for the
same module (for example, staged migration from default to named exports).

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R008

## Further reading

- [MDN: `import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
