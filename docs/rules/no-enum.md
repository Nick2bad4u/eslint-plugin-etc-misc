# no-enum

Disallow TypeScript `enum` declarations.

## Targeted pattern scope

This rule reports every TypeScript `enum` declaration (`TSEnumDeclaration`).

## What this rule reports

This rule reports every `enum` declaration. Enums emit runtime JavaScript and can complicate tree-shaking and interop. In codebases that prefer structural typing, literal unions and `as const` objects are easier to reason about and maintain.

## Why this rule exists

It enforces enum-free TypeScript style where literal unions and `as const`
objects are preferred over enum runtime constructs.

## ❌ Incorrect

```ts
enum Status {
 Ready,
 Running,
}
```

## ✅ Correct

```ts
const Status = {
 Ready: "Ready",
 Running: "Running",
} as const;

type Status = (typeof Status)[keyof typeof Status];
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is typically to `as const` object patterns plus derived union types.

### Options

This rule has no options.

## Additional examples

```ts
enum HttpCode {
 Ok = 200,
 NotFound = 404,
}
// ❌ reported

const HttpCode = {
 Ok: 200,
 NotFound: 404,
} as const;

type HttpCode = (typeof HttpCode)[keyof typeof HttpCode];
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-enum": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally standardizes on TypeScript enums and accepts their emitted runtime output.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R035

## Further reading

- [TypeScript Handbook: Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
