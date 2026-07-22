# typescript/no-inferrable-types

Disallow explicit primitive type annotations when the type is inferrable.

## Targeted pattern scope

This rule targets type annotations on:

- class property definitions initialized with literal values, and
- variable declarators initialized with literal values.

## What this rule reports

This rule reports explicit annotations where a literal initializer already
provides obvious type information.

## Why this rule exists

Removing redundant literal-based annotations can reduce noise and keep
declarations concise.

## ❌ Incorrect

```ts
const value: number = 1;
```

## ✅ Correct

```ts
const value = 1;
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`@typescript-eslint/no-inferrable-types`](https://typescript-eslint.io/rules/no-inferrable-types)

## Behavior and migration notes

This rule is deprecated in favor of
`@typescript-eslint/no-inferrable-types`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
class Counter {
 count: number = 0;
 // ❌ reported
}

class CounterFixed {
 count = 0;
 // ✅ valid
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-inferrable-types": "error",
  },
 },
];
```

## When not to use it

Disable this rule if explicit primitive annotations are required for readability.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R116

## Further reading

- [@typescript-eslint/no-inferrable-types](https://typescript-eslint.io/rules/no-inferrable-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
