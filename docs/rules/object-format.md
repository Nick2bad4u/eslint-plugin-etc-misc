# object-format

Enforce object literal line format based on property count.

## Targeted pattern scope

This rule checks `ObjectExpression` nodes with more than one property and
enforces single-line or multi-line formatting based on property count.

## What this rule reports

For each object literal with at least two properties:

- if property count is less than or equal to `maxProperties`, the object must be
  on a single line;
- otherwise, the object must span multiple lines.

## Why this rule exists

Object literals with inconsistent line formatting are harder to scan. A
threshold-based policy keeps short objects compact while forcing larger objects
to be readable.

## ❌ Incorrect

```ts
// default maxProperties: 1
const point = { x: 1, y: 2 };
```

## ✅ Correct

```ts
// default maxProperties: 1
const point = {
 x: 1,
 y: 2,
};
```

```ts
// with { maxProperties: 2 }
const point = { x: 1, y: 2 };
```

## Behavior and migration notes

This rule currently reports only and does not provide an autofix.

Adopt in warning mode first, then align formatting manually (or with codemods)
before enforcing as `error`.

### Options

```ts
type Options = [
 {
  maxProperties?: number; // default: 1
 },
];
```

- `maxProperties`: maximum number of properties allowed on one line.

### Default configuration

```ts
[{ maxProperties: 1 }];
```

## Additional examples

```ts
const pair = { left: 1, right: 2 };
// ✅ valid when configured with { maxProperties: 2 }

const tupleLike = {
 first: 1,
 second: 2,
 third: 3,
};
// ✅ required when maxProperties is 2
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/object-format": "error",
  },
 },
];
```

## When not to use it

Disable this rule if Prettier (or another formatter) already defines the object
wrapping strategy you want and this threshold approach conflicts with it.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R073

## Further reading

- [MDN: Object initializer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Object_initializer)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
