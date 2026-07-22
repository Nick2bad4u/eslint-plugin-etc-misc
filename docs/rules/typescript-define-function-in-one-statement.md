# typescript/define-function-in-one-statement

Require defining function properties in a single statement.

## Targeted pattern scope

This rule matches assignment expressions where:

- the left-hand side is a member expression whose object resolves to one
  locally declared function, function expression, or arrow function, and
- the assignment operator is `=`.

## What this rule reports

This rule reports property definitions attached to callable values, such as
`function name() {}; name.handler = value`. Properties on ordinary objects and
logical assignments are not reported.

## Why this rule exists

The intended style is to define callable values and attached properties together
in one expression (commonly via `Object.assign`).

## ❌ Incorrect

```ts
function load() {}
load.cache = new Map();
```

## ✅ Correct

```ts
const f = Object.assign(() => {}, { x: 1 });
```

```ts
const handlers = {};
handlers.load = () => loadData();
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Replacement:** None.
- **Alternative API:** [`Object.assign`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

## Behavior and migration notes

This rule is deprecated without replacement because its style policy is too
narrow and error-prone. It reports only and does not provide an autofix.

### Options

This rule has no options.

## Additional examples

```ts
const factory = Object.assign(() => 1, { cache: new Map() });
// ✅ valid

const obj = {};
obj.handler = () => 1;
// ✅ valid: obj is not callable
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

> **Rule catalog ID:** R110

## Further reading

- [MDN: Object.assign](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
