# no-assign-mutated-array

Disallow assigning values returned from mutating array methods.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports assignments or argument passing of values returned by `fill`, `reverse`, and `sort` when those methods mutate an existing array reference.

These methods mutate in place and return the same array instance. Assigning their return value often reads like a copy operation even though it mutates shared state.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
const names = ["c", "a", "b"];
const sorted = names.sort();
```

```ts
const names = ["c", "a", "b"];
print(names.reverse());
```

## ✅ Correct

```ts
const names = ["c", "a", "b"];
names.sort();
```

```ts
const names = ["c", "a", "b"];
const sorted = names.slice().sort();
```

```ts
const names = ["c", "a", "b"];
const sorted = names.map((name) => name).reverse();
```

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

This rule has no options.

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
