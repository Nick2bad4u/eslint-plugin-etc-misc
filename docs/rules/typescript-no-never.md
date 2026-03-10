# typescript/no-never

Disallow inferred identifier types of `never`.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule checks identifier nodes and asks TypeScript for the constrained type
at each identifier location.

Explicit type alias declarations of the form `type X = never` are excluded.

## What this rule reports

This rule uses TypeScript type checking to report identifiers inferred as `never`.

## Why this rule exists

Unexpected `never` often indicates unreachable code paths, impossible
constraints, or over-narrowed generics.

## ❌ Incorrect

```ts
const fail = (): never => {
    throw new Error("x");
};

const result = fail();
```

## ✅ Correct

```ts
type Never = never;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Because it is type-driven, enable it only in lint configurations with parser
services available.

### Options

This rule has no options.

## Additional examples

```ts
function assertNever(_value: never): never {
    throw new Error("unexpected");
}

type NeverAlias = never;
// ✅ alias declaration itself is intentionally excluded
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/no-never": "error",
        },
    },
];
```

## When not to use it

Disable this rule if inferred `never` identifiers are accepted in your codebase.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R091

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
