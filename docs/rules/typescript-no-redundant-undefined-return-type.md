# typescript/no-redundant-undefined-return-type

Disallow redundant `undefined` in return type unions when a function
deterministically returns a definitely-defined value.

## Targeted pattern scope

This rule targets functions with:

- an explicit return type union including `undefined`, and
- a function body that deterministically returns a syntactically definitely
  defined value.

The current deterministic patterns are intentionally conservative:

- expression-bodied functions returning definitely defined expressions
- block-bodied functions with exactly one `return` statement whose argument is
  definitely defined

## What this rule reports

This rule reports cases such as:

- `(): string | undefined => "x"`
- `function f(): number | undefined { return 1; }`

because the implementation deterministically returns a defined value, making
`| undefined` redundant.

## Why this rule exists

When function implementations deterministically return defined
values, keeping `| undefined` in the return type adds type noise and weakens API
clarity.

## ❌ Incorrect

```ts
const read = (): string | undefined => "x";

function count(): number | undefined {
 return 1;
}

class Box {
 get label(): string | undefined {
  return "box";
 }
}
```

## ✅ Correct

```ts
const read = (): string => "x";

function count(): number {
 return 1;
}

class Box {
 get label(): string {
  return "box";
 }
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the top-level return type union while
preserving remaining union members.

To avoid unsafe assumptions, this rule intentionally does not report complex
control-flow cases where proving deterministic non-`undefined` return values is
not trivial.

### Options

This rule has no options.

## Additional examples

```ts
const value: string | undefined = undefined;
const read = (): string | undefined => value;
// ✅ valid (returned identifier may be undefined)

function read(): string | undefined {
 const value = "x";
 return value;
}
// ✅ valid (multiple statements in block body are out of conservative scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-redundant-undefined-return-type": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally keeps explicit `| undefined` in
return types for stylistic consistency, even when current implementations are
deterministically defined.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R125

## Further reading

- [TypeScript Handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
