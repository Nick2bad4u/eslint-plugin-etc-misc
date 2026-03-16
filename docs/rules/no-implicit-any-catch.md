# no-implicit-any-catch

Require explicit error parameter typing in Promise rejection callbacks.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets Promise rejection callbacks in:

- `.catch(callback)`
- `.then(onFulfilled, onRejected)` (second argument)

Only callbacks associated with Promise-like receivers are checked.

## What this rule reports

Promise rejection callbacks often default the error parameter to implicit `any`.
That weakens type safety and makes unsafe property access easy to miss.

This rule enforces explicit typing for Promise rejection callback parameters in
`.catch(...)` and the rejection handler position of `.then(...)`.

By default:

- Implicit `any` is reported and auto-fixed to `unknown`.
- Explicit `any` is reported and auto-fixed to `unknown`.
- Narrower types (for example `string`) are reported with a safe suggestion to
  change to `unknown`.

## Why this rule exists

It prevents unsafe assumptions about rejection values and encourages explicit
narrowing before property access.

## ❌ Incorrect

```ts
Promise.reject(new Error("Boom")).catch((error) => {
 console.error(error);
});
```

```ts
Promise.reject(new Error("Boom")).catch((error: any) => {
 console.error(error);
});
```

## ✅ Correct

```ts
Promise.reject(new Error("Boom")).catch((error: unknown) => {
 if (error instanceof Error) {
  console.error(error.message);
 }
});
```

## Behavior and migration notes

This rule is fixable and also provides explicit `suggest` entries.

Automatic fixes annotate missing/`any` parameters as `unknown`. For already
narrowed annotations, a safe suggestion is provided instead of forced rewrite.

### Options

```ts
type Options = [
 {
  allowExplicitAny?: boolean;
 }?,
];
```

Default:

```ts
[{}];
```

### `allowExplicitAny`

Set `allowExplicitAny: true` to allow explicit `any` annotations in Promise
rejection callbacks.

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-implicit-any-catch": [
    "error",
    {
     allowExplicitAny: true,
    },
   ],
  },
 },
];
```

## Additional examples

```ts
Promise.resolve(1).then(
 (value) => value,
 (error: string) => {
  console.error(error);
 }
);
// ❌ reported as narrowed type, with suggestion to use unknown

Promise.resolve(1).catch((error: unknown) => {
 if (error instanceof Error) {
  console.error(error.message);
 }
});
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-implicit-any-catch": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally relies on broad rejection
parameter typing and you do not want to enforce explicit `unknown` handling.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R026

## Further reading

- [TypeScript-ESLint: no-implicit-any-catch](https://typescript-eslint.io/rules/no-implicit-any-catch/)
- [Catching Unknowns](https://ncjamieson.com/catching-unknowns/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
