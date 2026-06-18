# consistent-filename

Enforce filename casing consistency.

## Targeted pattern scope

This rule validates the current file's stem (filename without extension) against
one configured casing format.

## What this rule reports

This rule reports a file when its stem is not already in the configured casing.

Supported casing formats:

- `camelCase`
- `kebab-case` (default)
- `PascalCase`

## Why this rule exists

Consistent file naming reduces navigation friction and prevents style drift
across packages.

## ❌ Incorrect

```ts
// filename: user_service.ts
export const value = 1;
// ❌ with default format "kebab-case"
```

## ✅ Correct

```ts
// filename: user-service.ts
export const value = 1;
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`unicorn/filename-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md)

## Behavior and migration notes

This rule is deprecated in favor of `unicorn/filename-case`.

It reports only and does not provide an autofix.

### Options

```ts
type Options = [
 {
  format?: "camelCase" | "kebab-case" | "PascalCase";
 },
];
```

Default:

```ts
{
 format: "kebab-case";
}
```

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
// filename: dataLoader.ts
// ✅ valid with { format: "camelCase" }

// filename: DataLoader.ts
// ✅ valid with { format: "PascalCase" }
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/consistent-filename": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your repository intentionally mixes naming styles by
directory or if you are already standardizing on `unicorn/filename-case`.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R006

## Further reading

- [eslint-plugin-unicorn: filename-case](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
