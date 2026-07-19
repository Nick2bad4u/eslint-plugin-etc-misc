# typescript/no-redundant-undefined-readonly-property

Disallow redundant `undefined` in readonly property union types when the
initializer is definitely defined.

## Targeted pattern scope

This rule targets class fields that are:

- declared `readonly`,
- not optional (`?` is absent),
- annotated as a union including `undefined`, and
- initialized with a syntactically definitely defined value (for example
  string, number, object, array, template literal, function, class, or `new`
  value).

## What this rule reports

This rule reports declarations such as:

- `readonly value: string | undefined = "x";`
- `static readonly count: number | undefined = 0;`

because the initializer is definitely defined, so `| undefined` is redundant.

## Why this rule exists

Readonly fields with definitely defined initializers already have a concrete
value at declaration time. Keeping `| undefined` in those annotations adds type
noise and weakens type precision.

## ❌ Incorrect

```ts
class Box {
 readonly value: string | undefined = "x";
 static readonly count: number | undefined = 0;
}
```

## ✅ Correct

```ts
class Box {
 readonly value: string = "x";
 static readonly count: number = 0;
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the readonly property union type while
preserving the remaining union constituents.

To avoid unsafe assumptions, this rule does not report initializers that can
plausibly evaluate to `undefined` (for example identifiers, calls, or other
non-guaranteed-defined expressions).

This rule has no options.

## Additional examples

```ts
const maybe = undefined as string | undefined;

class Box {
 readonly value: string | undefined = maybe;
 // ✅ valid (initializer may be undefined)

 value2: string | undefined = "x";
 // ✅ valid (not readonly)
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-redundant-undefined-readonly-property": "warn",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally preserves explicit `| undefined`
on readonly property annotations for stylistic consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R100

## Further reading

- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
