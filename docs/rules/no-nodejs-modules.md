# no-nodejs-modules

Disallow importing Node.js built-ins via the `node:` protocol.

## Targeted pattern scope

This rule checks import/export source strings across:

- `import ... from "..."`
- `export ... from "..."`
- `export * from "..."`
- dynamic `import("...")`

By default it disallows sources matching `node:*`.

## What this rule reports

This rule reports source strings that match `"node:*"`.

## Why this rule exists

Some codebases standardize on unprefixed built-in specifiers (`fs`, `path`) for
compatibility or stylistic consistency. This rule enforces that policy.

## ❌ Incorrect

```ts
import fs from "node:fs";
```

## ✅ Correct

```ts
import fs from "fs";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is generally mechanical: replace `node:fs` with `fs`, `node:path`
with `path`, and so on.

### Options

```ts
type Options = {
 allow?: string[];
 disallow?: string[];
};
```

Default:

```json
{
 "disallow": ["node:*"]
}
```

## Additional examples

```ts
export { readFile } from "node:fs/promises";
// ❌ reported by default

const fsModule = await import("fs");
// ✅ valid with default settings
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-nodejs-modules": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally requires `node:`-prefixed imports.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R034

## Further reading

- [Node.js: Built-in modules and `node:` specifiers](https://nodejs.org/api/modules.html#built-in-modules)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
