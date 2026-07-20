# throw-error

Disallow throwing or rejecting values that are not `Error`-like.

> ⚠️ This rule requires type information to run.

## Targeted pattern scope

This rule checks:

- `ThrowStatement` arguments,
- `Promise.reject(...)` calls,
- `reject(...)` calls inside `new Promise((resolve, reject) => ...)` executors.

## What this rule reports

This rule reports values that are not `Error`-like when thrown or used as Promise rejection values.

It allows:

- `Error` and `DOMException` values,
- values that could be `any` or `unknown` (to avoid unsafe assumptions during static analysis).

## Why this rule exists

Throwing primitives or arbitrary objects makes error handling inconsistent and often forces fragile downstream narrowing logic. Enforcing `Error`-like values improves reliability and observability.

## ❌ Incorrect

```ts
throw "kaboom";
```

```ts
Promise.reject("kaboom");
```

```ts
new Promise((resolve, reject) => reject("kaboom"));
```

## ✅ Correct

```ts
throw new Error("kaboom");
```

```ts
throw new DOMException("kaboom");
```

```ts
Promise.reject(new Error("kaboom"));
```

```ts
new Promise((resolve, reject) => reject(new Error("kaboom")));
```

## Behavior and migration notes

This rule has no options.

## Additional examples

```ts
declare const maybeUnknown: unknown;
throw maybeUnknown;
// ✅ allowed (unknown is intentionally permitted)

const payload = { code: "E_FAIL" };
throw payload;
// ❌ reported (not Error-like)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/throw-error": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses non-`Error` throw/reject values and has established handling utilities for that pattern.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R100

## Further reading

- [MDN: throw](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/throw)
- [MDN: Error](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN: Promise.reject()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
