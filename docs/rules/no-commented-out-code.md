# no-commented-out-code

Disallow comment blocks that appear to contain executable or declaration code.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-commented-code/no-commented-code`](https://www.npmjs.com/package/eslint-plugin-no-commented-code)

## Rule Details

Commented-out code creates maintenance noise, hides stale implementation paths,
and can mislead readers into thinking dead code is still relevant. This rule
parses comments and reports ones that look like real code.

The rule intentionally ignores non-code commentary patterns like region markers
and plain prose notes.

### ❌ Incorrect

```ts
// const answer = 54;
const answer = 42;
```

```ts
class Example {
  public a: string;
  // public b: string;
  public c: string;
}
```

### ✅ Correct

```ts
// Explanation: historical implementation tried 54 first.
const answer = 42;
```

```ts
class Example {
  // #region Public API
  public execute(): void {}
  // #endregion
}
```

## Options

This rule has no options.

## ESLint Flat Config Example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
  {
    plugins: { "etc-misc": etcMisc },
    rules: {
      "etc-misc/no-commented-out-code": "error",
    },
  },
];
```

## When Not To Use It

Disable this rule if your team intentionally keeps commented examples inline
instead of using docs, snippets, or tests.

## Further Reading

- [ESLint: Working with Rules](https://eslint.org/docs/latest/extend/custom-rules)
- [TypeScript-ESLint: Custom Rules](https://typescript-eslint.io/developers/custom-rules/)
