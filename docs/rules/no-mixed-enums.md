# no-mixed-enums

Disallow enum members that mix numeric and string representations.

## Targeted pattern scope

This rule targets TypeScript `enum` declarations.

## What this rule reports

This rule reports enums that mix member value kinds (for example, both string
and numeric members).

## Why this rule exists

Mixed enum value kinds make comparisons and serialization rules harder to
understand.

## ❌ Incorrect

```ts
enum State {
    open = "open",
    closed = 2,
}
```

## ✅ Correct

```ts
enum State {
    open = 1,
    closed = 2,
}
```

## Behavior and migration notes

This rule forwards options and behavior to
`@typescript-eslint/no-mixed-enums`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-mixed-enums`](https://typescript-eslint.io/rules/no-mixed-enums)

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
            "etc-misc/no-mixed-enums": "error",
        },
    },
];
```

## When not to use it

Disable this rule if mixed enums are required for compatibility with external
wire formats.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R032

## Further reading

- [typescript-eslint: `no-mixed-enums`](https://typescript-eslint.io/rules/no-mixed-enums)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
