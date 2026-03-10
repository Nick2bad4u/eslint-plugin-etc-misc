# no-writeonly

Disallow setter-only accessors.

## Targeted pattern scope

This rule targets object and class accessors.

## What this rule reports

This rule reports setters that do not have corresponding getters.

## Why this rule exists

Write-only properties hide state flow and make object behavior harder to debug.

## ❌ Incorrect

```ts
const state = {
    set value(next: number) {
        this._value = next;
    },
};
```

## ✅ Correct

```ts
const state = {
    _value: 0,
    get value() {
        return this._value;
    },
    set value(next: number) {
        this._value = next;
    },
};
```

## Behavior and migration notes

This rule forwards options and behavior to ESLint core `accessor-pairs`.

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
            "etc-misc/no-writeonly": "error",
        },
    },
];
```

## When not to use it

Disable this rule if you intentionally use write-only sink objects and the
pattern is documented.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R052

## Further reading

- [ESLint: `accessor-pairs`](https://eslint.org/docs/latest/rules/accessor-pairs)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
