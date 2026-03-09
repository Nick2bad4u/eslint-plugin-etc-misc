# prefer-only-export

Disallow additional exports alongside a default export.

## Targeted pattern scope

This rule targets modules that contain a `default` export together with at
least one additional export declaration.

## What this rule reports

This rule reports files where default and named exports are mixed.

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

> **Rule catalog ID:** R061

## Further reading

- [MDN: `export` statement](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)
- [TypeScript Handbook: Modules](https://www.typescriptlang.org/docs/handbook/modules/introduction.html)
