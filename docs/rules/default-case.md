# default-case

Require a `default` branch in `switch` statements.

## Targeted pattern scope

This rule targets all JavaScript and TypeScript `switch` statements.

## What this rule reports

This rule reports `switch` statements that do not include a `default` case.

## Why this rule exists

Missing defaults can silently ignore unexpected values and create fragile
control flow.

## ❌ Incorrect

```ts
switch (status) {
    case "open":
        break;
}
```

## ✅ Correct

```ts
switch (status) {
    case "open":
        break;
    default:
        break;
}
```

## Behavior and migration notes

This rule forwards options and behavior to ESLint core `default-case`.

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
            "etc-misc/default-case": "error",
        },
    },
];
```

## When not to use it

Disable this rule if you enforce exhaustive unions with explicit `never`
checks and intentionally avoid `default` branches.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R011

## Further reading

- [ESLint: `default-case`](https://eslint.org/docs/latest/rules/default-case)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
