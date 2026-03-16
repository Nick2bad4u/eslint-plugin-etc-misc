# typescript/no-redundant-undefined-const

Disallow redundant `undefined` in `const` declaration union types when the
initializer is definitely defined.

## Targeted pattern scope

This rule targets `const` declarations that combine:

- a union type including `undefined`, and
- a syntactically definitely defined initializer (for example string, number,
  object, array, template literal, function, class, or `new` value).

## What this rule reports

This rule reports declarations such as:

- `const value: string | undefined = "x";`
- `const count: number | undefined = 0;`

because the initializer is definitely defined, making `| undefined` redundant.

## Why this rule exists

For definitely defined `const` initializers, keeping `| undefined` in the
annotation adds type noise and obscures intent without improving safety.

## ❌ Incorrect

```ts
const value: string | undefined = "x";
const count: number | undefined = 0;
const config: { enabled: boolean } | undefined = { enabled: true };
```

## ✅ Correct

```ts
const value: string = "x";
const count: number = 0;
const config: { enabled: boolean } = { enabled: true };
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the union annotation and preserves the other
constituents.

To avoid unsafe assumptions, this rule intentionally does not report
initializers that may evaluate to `undefined` (for example identifiers, calls,
or other non-guaranteed-defined expressions).

This rule has no options.

## Additional examples

```ts
const maybe = Math.random() > 0.5 ? "x" : undefined;
const value: string | undefined = maybe;
// ✅ valid (initializer can be undefined)

let mutableValue: string | undefined = "x";
// ✅ valid (rule only targets const declarations)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-redundant-undefined-const": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally keeps explicit `| undefined` on
`const` declarations as a style convention.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R092

## Further reading

- [TypeScript Handbook: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
