# disallow-import

Disallow import/export sources by configured glob patterns.

## Targeted pattern scope

This rule checks module source strings in:

- `import ... from "..."`
- `export ... from "..."`
- `export * from "..."`
- dynamic `import("...")`

It matches those source values against glob patterns.

## What this rule reports

This rule matches import and export source values against `disallow` globs, with optional `allow` exceptions.

## Why this rule exists

This rule is a general boundary primitive: it lets you ban path families and
optionally carve out explicit exceptions.

## ❌ Incorrect

```ts
import value from "../source";
```

with options:

```ts
{ disallow: ["../**"] }
```

## ✅ Correct

```ts
import value from "../source";
```

with options:

```ts
{ disallow: ["../**"], allow: ["../source"] }
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Because the default `disallow` set is empty, this rule does nothing until you
configure `disallow` patterns.

### Options

```ts
type Options = {
    allow?: string[];
    disallow?: string[];
};
```

## Additional examples

```ts
// config: { disallow: ["../**"], allow: ["../shared/**"] }
import util from "../feature/util";
// ❌ reported

import shared from "../shared/math";
// ✅ allowed by explicit exception
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/disallow-import": ["error", { disallow: ["../**"] }],
        },
    },
];
```

## When not to use it

Disable this rule if your project does not enforce import path restrictions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R012

## Further reading

- [minimatch glob pattern reference](https://github.com/isaacs/minimatch)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
