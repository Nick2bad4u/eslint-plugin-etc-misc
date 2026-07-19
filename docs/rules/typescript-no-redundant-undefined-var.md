# typescript/no-redundant-undefined-var

Disallow redundant `undefined` in `var` type unions when declarations are never
reassigned and initialized with definitely-defined values.

## Targeted pattern scope

This rule targets `var` declarations that are:

- initialized with a syntactically definitely-defined value (for example
  string, number, object, array, template literal, function, class, or `new`
  value),
- explicitly typed as a union including `undefined`, and
- never reassigned after declaration.

## What this rule reports

This rule reports declarations such as:

- `var value: string | undefined = "x";`

when the variable is never reassigned and initializer is definitely defined.
In those cases, `| undefined` is redundant.

## Why this rule exists

Legacy code can still use `var` for values that are never reassigned and are
initialized with definite values. In those cases, retaining `| undefined` adds
type noise and weakens type precision.

## ❌ Incorrect

```ts
var value: string | undefined = "x";
var count: number | undefined = 1 as const;
```

## ✅ Correct

```ts
var value: string = "x";
var count: number = 1 as const;
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the top-level `var` type union while
preserving remaining union members.

To avoid unsafe assumptions, this rule does not report cases where:

- the initializer might evaluate to `undefined`, or
- the variable is reassigned later.

### Options

This rule has no options.

## Additional examples

```ts
var value: string | undefined = "x";
value = "y";
// ✅ valid (reassigned)

const maybe = undefined as string | undefined;
var output: string | undefined = maybe;
// ✅ valid (initializer may be undefined)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-redundant-undefined-var": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally keeps explicit `| undefined` in
never-reassigned `var` annotations for stylistic consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R102

## Further reading

- [TypeScript Handbook: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
