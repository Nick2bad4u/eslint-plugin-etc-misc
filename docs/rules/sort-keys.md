# sort-keys

Enforce alphabetical sorting of object keys.

## Targeted pattern scope

This rule checks object literals (`ObjectExpression`) and evaluates non-computed
initializer properties (`Property` with `kind: "init"`).

Supported sortable keys are:

- identifier keys (`foo`)
- string literal keys (`"foo"`)

Computed keys, spread entries, and accessor properties are not part of sorting.

## What this rule reports

This rule reports object properties that are out of alphabetical order.

An autofix is provided and rewrites the property sequence in sorted order.

## Why this rule exists

Sorted keys make large object literals easier to navigate and reduce churn when
multiple contributors add new properties.

## ❌ Incorrect

```ts
const config = {
    zIndex: 10,
    align: "start",
};
```

## ✅ Correct

```ts
const config = {
    align: "start",
    zIndex: 10,
};
```

## Behavior and migration notes

This rule is autofixable for supported property shapes.

If an object contains unsupported sortable keys, the rule may skip reporting for
that object to avoid unsafe transformations.

### Options

This rule has no options.

## Additional examples

```ts
const tokens = {
    "a-color": "#000",
    zColor: "#fff",
};
// ✅ mixed identifier/string keys are sorted by key text

const partial = {
    b: 2,
    [dynamicKey]: 1,
    a: 1,
};
// ⚠️ contains a computed key; sorting behavior is intentionally conservative
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/sort-keys": "error",
        },
    },
];
```

## When not to use it

Disable this rule when property order communicates intent (for example, display
sections, execution sequence, or business-priority grouping).

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R070

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
