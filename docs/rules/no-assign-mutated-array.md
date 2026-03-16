# no-assign-mutated-array

Disallow assigning values returned from mutating array methods.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting
(`parserOptions.project` or `projectService`) before enabling it.

This rule targets calls to `fill`, `reverse`, and `sort` on array-like values.

It reports when these calls are used as values (for example assignment,
argument, return), not when used as standalone statements.

## What this rule reports

This rule reports assignments or argument passing of values returned by `fill`, `reverse`, and `sort` when those methods mutate an existing array reference.

These methods mutate in place and return the same array instance. Assigning their return value often reads like a copy operation even though it mutates shared state.

## Why this rule exists

Using the returned value of mutating methods often looks copy-like while still
mutating shared state, which causes subtle bugs.

## ❌ Incorrect

```ts
const names = [
 "c",
 "a",
 "b",
];
const sorted = names.sort();
```

```ts
const names = [
 "c",
 "a",
 "b",
];
print(names.reverse());
```

```ts
const sorted = users.sort();
return sorted;
```

## ✅ Correct

```ts
const names = [
 "c",
 "a",
 "b",
];
names.sort();
```

```ts
const names = [
 "c",
 "a",
 "b",
];
const sorted = names.slice().sort();
```

```ts
const names = [
 "c",
 "a",
 "b",
];
const sorted = names.map((name) => name).reverse();
```

```ts
const sorted = Array.from(users).sort();
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

It intentionally does not report when the mutating call is rooted in a new array
expression or array factory chain (for example `Array.from(...).sort()`).

### Options

This rule has no options.

## Additional examples

```ts
const result = source.slice().sort();
// ✅ valid because `slice()` creates a new array before sort

const result2 = source.sort();
// ❌ reported because `sort()` mutates `source`
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-assign-mutated-array": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally relies on mutating array methods and treats assigned return values as an accepted pattern.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R016

## Further reading

- [MDN: Array.prototype.fill()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
- [MDN: Array.prototype.reverse()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
- [MDN: Array.prototype.sort()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
