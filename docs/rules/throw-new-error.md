# throw-new-error

Require `new` when throwing error instances.

## Targeted pattern scope

This rule targets thrown error-constructor call expressions.

## What this rule reports

This rule reports `throw Error(...)` and related patterns without `new`.

## Why this rule exists

`throw new Error(...)` is explicit and consistent with constructor semantics.

## ❌ Incorrect

```ts
throw Error("Boom");
```

## ✅ Correct

```ts
throw new Error("Boom");
```

## Behavior and migration notes

This rule forwards options and behavior to `unicorn/throw-new-error`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`unicorn/throw-new-error`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md)

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/throw-new-error": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally uses the function-call style
for Error constructors.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R075

## Further reading

- [unicorn: `throw-new-error`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md)
