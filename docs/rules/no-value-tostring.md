# no-value-tostring

Disallow calling `.toString()` on values that may not provide meaningful output.

> ⚠️ This rule requires type information to run.

## Targeted pattern scope

This rule targets `.toString()` and related stringification calls in typed
TypeScript code.

## What this rule reports

This rule reports stringification that could produce unhelpful default object
representations.

## Why this rule exists

Calling `.toString()` on broad object types can produce `"[object Object]"`
instead of useful text. This rule reports potentially unsafe stringification.

## ❌ Incorrect

```ts
const value: {} = {};
value.toString();
```

## ✅ Correct

```ts
const value = 42;
value.toString();
```

## Behavior and migration notes

This rule forwards options to `@typescript-eslint/no-base-to-string`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-base-to-string`](https://typescript-eslint.io/rules/no-base-to-string)

## Additional examples

```ts
declare const value: {};
String(value);
// ❌ reported by forwarded `no-base-to-string` behavior

declare const value: Date;
value.toString();
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-value-tostring": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase intentionally permits object default
stringification and that behavior is covered by runtime tests.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R053

## Further reading

- [typescript-eslint: `no-base-to-string`](https://typescript-eslint.io/rules/no-base-to-string)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
