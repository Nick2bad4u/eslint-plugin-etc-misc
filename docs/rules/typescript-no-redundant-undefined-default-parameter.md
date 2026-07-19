# typescript/no-redundant-undefined-default-parameter

Disallow redundant `undefined` in default parameter union types when the
default initializer is definitely defined.

## Targeted pattern scope

This rule targets parameters that have:

- a default initializer (`=`), and
- a union type including `undefined`, and
- an initializer that is syntactically definitely defined (for example string,
  number, object, array, template literal, function, class, or `new` value).

## What this rule reports

This rule reports defaulted parameters such as:

- `value: string | undefined = "x"`
- `count: number | undefined = 0`

because a definitely defined initializer means runtime `undefined` input is
already handled by the default assignment.

## Why this rule exists

Keeping `| undefined` on parameters with definitely defined default values adds
type noise and can obscure intent. In these cases, the annotation is usually
clearer as the non-`undefined` type.

## ❌ Incorrect

```ts
function read(value: string | undefined = "x") {
 return value;
}

const pick = (count: number | undefined = 0) => count;

class Box {
 constructor(private label: string | undefined = "box") {}
}
```

## ✅ Correct

```ts
function read(value: string = "x") {
 return value;
}

const pick = (count: number = 0) => count;

class Box {
 constructor(private label: string = "box") {}
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the parameter union type and preserves all
remaining union constituents.

To avoid unsafe assumptions, this rule intentionally does not report default
initializers that might evaluate to `undefined` (for example identifiers,
calls, or other non-guaranteed-defined expressions).

### Options

This rule has no options.

## Additional examples

```ts
const maybe = undefined as string | undefined;
function read(value: string | undefined = maybe) {
 return value;
}
// ✅ valid (initializer may be undefined)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-redundant-undefined-default-parameter": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally keeps explicit `| undefined` for
defaulted parameters for stylistic consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R096

## Further reading

- [TypeScript Handbook: Optional and Default Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-and-default-parameters)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
