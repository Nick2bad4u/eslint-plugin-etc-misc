# no-internal-modules

Disallow importing nested internal module paths.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports imports/exports that target internal module segments such as:

- `./folder/internal`
- `package/internal`
- `@scope/package/internal`

It allows top-level entry imports such as `./folder`, `package`, and `@scope/package`.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
import a from "./folder/internal";
import b from "package/internal";
import c from "@scope/package/internal";
```

## ✅ Correct

```ts
import a from "./folder";
import b from "package";
import c from "@scope/package";
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
    "disallow": ["./*/**", "[^@]*/**", "@?*/*/**"]
}
```

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
            "etc-misc/no-internal-modules": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally imports deep internal module paths.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R029

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
