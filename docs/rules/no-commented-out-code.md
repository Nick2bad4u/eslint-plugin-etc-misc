# no-commented-out-code

Disallow comment blocks that appear to contain executable or declaration code.

## Targeted pattern scope

This rule analyzes all comments in the file (line and block) and tries to parse
their content as code.

It supports grouped consecutive line comments as one logical comment block.

## What this rule reports

Commented-out code creates maintenance noise, hides stale implementation paths,
and can mislead readers into thinking dead code is still relevant.

The rule reports comment blocks that parse as non-trivial code.

The rule intentionally ignores non-code commentary patterns like region markers
and plain prose notes.

## Why this rule exists

Keeping dead code in comments makes reviews and refactors harder. This rule
helps enforce a cleaner baseline.

## ❌ Incorrect

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

## ✅ Correct

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

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-commented-code/no-commented-code`](https://www.npmjs.com/package/eslint-plugin-no-commented-code)

## Behavior and migration notes

This rule is deprecated in favor of
`no-commented-code/no-commented-code`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
// #region Helpers
// #endregion
// ✅ ignored as region marker comments

// if (flag) {
//   run();
// }
// ❌ reported as commented-out executable code
```

## ESLint flat config example

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

## When not to use it

Disable this rule if your team intentionally keeps commented examples inline
instead of using docs, snippets, or tests.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R020

## Further reading

- [ESLint: Working with Rules](https://eslint.org/docs/latest/extend/custom-rules)
- [TypeScript-ESLint: Custom Rules](https://typescript-eslint.io/developers/custom-rules/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
