# require-syntax

Require syntax matched by configured AST selectors.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports when a configured selector has no matches in the file.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
const x = 1;
```

with options:

```ts
{ selectors: ["ExportDefaultDeclaration"] }
```

## ✅ Correct

```ts
export default 1;
```

with options:

```ts
{ selectors: ["ExportDefaultDeclaration"] }
```

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
            "etc-misc/require-syntax": [
                "error",
                { selectors: ["ExportDefaultDeclaration"] },
            ],
        },
    },
];
```

## When not to use it

Disable this rule if files should not be forced to contain specific syntax forms.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R063

## Further reading

- [ESLint selectors reference](https://eslint.org/docs/latest/extend/selectors)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
