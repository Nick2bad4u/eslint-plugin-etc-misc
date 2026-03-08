# prefer-less-than

Disallow greater-than comparisons in favor of less-than comparisons.

## Rule Details

This rule reports `>` and `>=` binary comparisons and rewrites them to equivalent `<` or `<=` comparisons with operands swapped.

Some teams prefer reading comparisons in ascending order (`min < value < max`) because it improves scanability in range checks.

### ❌ Incorrect

```ts
const isValid = value > min;
```

```ts
if (value >= min && value <= max) {
    run();
}
```

### ✅ Correct

```ts
const isValid = min < value;
```

```ts
if (min <= value && value <= max) {
    run();
}
```

## Auto-fixing

This rule is auto-fixable. The fixer swaps the left and right operands and replaces the operator:

- `>` → `<`
- `>=` → `<=`

## Options

This rule has no options.

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

## When Not To Use It

Disable this rule if your team intentionally prefers `>` and `>=` comparisons for readability.

## Further Reading

- [MDN: Less than (`<`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Less_than)
- [MDN: Greater than (`>`)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Greater_than)
