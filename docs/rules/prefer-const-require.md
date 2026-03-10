# prefer-const-require

Require assigning `require(...)` calls to a `const` variable.

## Targeted pattern scope

This rule targets `require(...)` calls that are not part of a variable
declaration.

## What this rule reports

This rule reports `require(...)` invocations used inline, such as return
expressions or nested call arguments.

## Why this rule exists

Binding imports to a named `const` improves readability, simplifies debugging,
and avoids repeated module resolution expressions in the same scope. It also
makes migration toward ESM import style easier.

## ❌ Incorrect

```ts
function loadPath() {
    return require("node:path");
}
```

## ✅ Correct

```ts
const path = require("node:path");

function loadPath() {
    return path;
}
```

## Behavior and migration notes

This rule has no options.

When adopting this rule, extract inline `require(...)` calls into top-level or
nearest-scope `const` bindings with descriptive names.

## Additional examples

```ts
logger.info(require("node:os").platform());
// ❌ reported: inline require call

const os = require("node:os");
logger.info(os.platform());
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/prefer-const-require": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally allows inline CommonJS loading
patterns (for example, lazy loading inside specific runtime branches).

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R056

## Further reading

- [Node.js: CommonJS modules](https://nodejs.org/api/modules.html)
- [TypeScript Handbook: Modules](https://www.typescriptlang.org/docs/handbook/modules/introduction.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
