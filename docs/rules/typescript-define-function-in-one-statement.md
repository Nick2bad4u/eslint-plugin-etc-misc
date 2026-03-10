# typescript/define-function-in-one-statement

Require defining function properties in a single statement.

## Targeted pattern scope

This rule currently matches assignment expressions where the left-hand side is
a member expression with an identifier object (for example `obj.x = ...`).

Although the rule name focuses on function properties, the selector is
syntactic and does not verify that the identifier is actually a function.

## What this rule reports

This rule reports assignment expressions where an identifier-based member is on
the left side (for example `name.prop = value`).

## Why this rule exists

The intended style is to define callable values and attached properties together
in one expression (commonly via `Object.assign`).

## ❌ Incorrect

```ts
function f() {}
f.x = 1;
```

## ✅ Correct

```ts
const f = Object.assign(() => {}, { x: 1 });
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

If you need stricter semantic behavior (function-only enforcement), supplement
with additional lint rules or custom checks.

### Options

This rule has no options.

## Additional examples

```ts
const factory = Object.assign(() => 1, { cache: new Map() });
// ✅ valid

const obj = {};
obj.version = 1;
// ❌ currently reported because selector is syntactic
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/define-function-in-one-statement": "error",
        },
    },
];
```

## When not to use it

Disable this rule if function property assignment across statements is accepted in your codebase.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R083

## Further reading

- [MDN: Object.assign](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
