# array-type

Enforce a consistent array type syntax.

## Targeted pattern scope

This rule targets TypeScript array type annotations.

## What this rule reports

This rule reports array types that do not match the configured style.

## Why this rule exists

Mixing `Array<T>` and `T[]` makes signatures harder to scan and causes avoidable
style churn.

## ❌ Incorrect

```ts
type Values = Array<string>;
```

## ✅ Correct

```ts
type Values = string[];
```

## Behavior and migration notes

This rule forwards options and behavior to `@typescript-eslint/array-type`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/array-type`](https://typescript-eslint.io/rules/array-type)

## Additional examples

```ts
// with default @typescript-eslint/array-type options
type Values = Array<string>;
// ❌ reported

type ValuesFixed = string[];
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/array-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally allows mixed array type styles.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R001

## Further reading

- [typescript-eslint: `array-type`](https://typescript-eslint.io/rules/array-type)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
