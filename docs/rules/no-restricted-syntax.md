# no-restricted-syntax

Disallow syntax matched by configured AST selectors.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports nodes selected by any configured selector in `selectors`.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
if (x) {
    y();
}
```

with options:

```ts
{ selectors: ["IfStatement"] }
```

## ✅ Correct

```ts
for (;;) {
    break;
}
```

with options:

```ts
{ selectors: ["IfStatement"] }
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax)

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

```ts
type Options = {
    selectors?: Array<
        | string
        | {
              message?: string;
              selector: string;
          }
    >;
};
```

### Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax)

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
            "etc-misc/no-restricted-syntax": [
                "error",
                { selectors: ["IfStatement"] },
            ],
        },
    },
];
```

## When not to use it

Disable this rule if your project does not rely on selector-based syntax restrictions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R037

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
