# prefer-less-than

Disallow greater-than comparisons in favor of less-than comparisons.

## Targeted pattern scope

This rule targets binary comparisons that use `>` or `>=`.

## What this rule reports

This rule reports `>` and `>=` expressions and provides fixes that swap operands
and convert operators to `<` or `<=`.

## Why this rule exists

Some teams prefer comparison chains that read in ascending order (for example,
`min <= value && value <= max`). Enforcing less-than style keeps range checks
visually consistent across a codebase.

## ❌ Incorrect

```ts
const isValid = value > min;

if (value >= min && value <= max) {
    run();
}
```

## ✅ Correct

```ts
const isValid = min < value;

if (min <= value && value <= max) {
    run();
}
```

## Behavior and migration notes

This rule has no options.

The rule is auto-fixable. The fixer swaps both operands and rewrites the
operator:

- `>` → `<`
- `>=` → `<=`

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/prefer-less-than": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your team intentionally uses greater-than comparisons for
readability and does not want operand-swapping autofixes.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R059

## Further reading

- [MDN: Less than (`<`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Less_than)
- [MDN: Greater than (`>`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Greater_than)
