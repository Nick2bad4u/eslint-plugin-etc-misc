# no-assign-mutated-array

Disallow assigning values returned from mutating array methods.

## Rule Details

This rule reports assignments or argument passing of values returned by `fill`, `reverse`, and `sort` when those methods mutate an existing array reference.

These methods mutate in place and return the same array instance. Assigning their return value often reads like a copy operation even though it mutates shared state.

### ❌ Incorrect

```ts
const names = ["c", "a", "b"];
const sorted = names.sort();
```

```ts
const names = ["c", "a", "b"];
print(names.reverse());
```

### ✅ Correct

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

## Options

This rule has no options.

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

## When Not To Use It

Disable this rule if your codebase intentionally relies on mutating array methods and treats assigned return values as an accepted pattern.

## Further Reading

- [MDN: Array.prototype.fill()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
- [MDN: Array.prototype.reverse()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
- [MDN: Array.prototype.sort()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
