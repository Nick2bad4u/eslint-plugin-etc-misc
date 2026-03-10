# no-implicit-any-catch

Require explicit error parameter typing in Promise rejection callbacks.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

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

> ⚠️ This rule requires type information to run.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

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

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

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

## Additional examples

```ts
// Add project-specific examples here when edge cases matter.
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
