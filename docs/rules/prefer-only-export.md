# prefer-only-export

Disallow additional exports alongside a default export.

## Targeted pattern scope

This rule targets program bodies where both are true:

- a `default` export exists, and
- the file has more than one top-level statement.

## What this rule reports

This rule reports files that contain `export default` plus any additional
top-level statement (including non-export statements).

## Why this rule exists

Some teams enforce a strict module contract: either a module exposes one default
value, or it exposes named exports, but not both. Mixing both styles can make
imports inconsistent across the codebase.

## ❌ Incorrect

```ts
export default 1;
export const x = 1;
```

## ✅ Correct

```ts
export default 1;
```

```ts
export const x = 1;
export const y = 2;
```

## Behavior and migration notes

This rule has no options.

## Additional examples

```ts
export default function main() {}
const helper = 1;
// ❌ reported by current implementation (second top-level statement)

export default function main() {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/prefer-only-export": "error",
  },
 },
];
```

## When not to use it

Disable this rule if combining default and named exports is allowed in your modules.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R064

## Further reading

- [MDN: `export` statement](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)
- [TypeScript Handbook: Modules](https://www.typescriptlang.org/docs/handbook/modules/introduction.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
