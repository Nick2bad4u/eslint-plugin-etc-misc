# no-implicit-any-catch

Require explicit error parameter typing in Promise rejection callbacks.

## Rule Details

Promise rejection callbacks often default the error parameter to implicit `any`.
That weakens type safety and makes unsafe property access easy to miss.

This rule enforces explicit typing for Promise rejection callback parameters in
`.catch(...)` and the rejection handler position of `.then(...)`.

By default:

- Implicit `any` is reported and auto-fixed to `unknown`.
- Explicit `any` is reported and auto-fixed to `unknown`.
- Narrower types (for example `string`) are reported with a safe suggestion to
  change to `unknown`.

> ⚠️ This rule requires type information to run.

### ❌ Incorrect

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

### ✅ Correct

```ts
Promise.reject(new Error("Boom")).catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  }
});
```

## Options

```ts
type Options = [
  {
    allowExplicitAny?: boolean;
  }?,
];
```

Default:

```ts
[{}]
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

## When Not To Use It

Disable this rule if your codebase intentionally relies on broad rejection
parameter typing and you do not want to enforce explicit `unknown` handling.

> **Rule catalog ID:** R026

## Further Reading

- [TypeScript-ESLint: no-implicit-any-catch](https://typescript-eslint.io/rules/no-implicit-any-catch/)
- [Catching Unknowns](https://ncjamieson.com/catching-unknowns/)
