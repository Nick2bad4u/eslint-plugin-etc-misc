# no-index-import

Disallow importing directly from `"."`.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports import and export source strings that are exactly `"."`.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
import value from ".";
export { value } from ".";
```

## ✅ Correct

```ts
import value from "./feature";
export { value } from "./feature";
```

## Behavior and migration notes

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

```ts
type Options = {
    allow?: string[];
    disallow?: string[];
};
```

Default:

```json
{
    "disallow": ["."]
}
```

- `allow`: glob patterns that are exempted.
- `disallow`: override default disallow patterns.

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
            "etc-misc/no-index-import": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally uses `"."` barrel imports.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R027

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
