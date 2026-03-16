# require-syntax

Require syntax matched by configured AST selectors.

## Targeted pattern scope

This rule runs selector listeners for every configured AST selector and tracks
whether each selector matched at least once in the current file.

Validation happens on `Program:exit`, so the rule evaluates full-file coverage
rather than local statement-level checks.

## What this rule reports

This rule reports each configured selector that has zero matches.

- If the selector is configured as a plain string, the default message is used.
- If the selector is configured as an object with `message`, your custom message
  is emitted.

## Why this rule exists

Some code standards are existential rather than prohibitive (for example,
"every module must export a default" or "every React file must declare props").
`require-syntax` is the inverse of `no-restricted-syntax`: it enforces presence,
not absence.

## ❌ Incorrect

```ts
const x = 1;
```

with options:

```ts
{
 selectors: ["ExportDefaultDeclaration"];
}
```

## ✅ Correct

```ts
export default 1;
```

with options:

```ts
{
 selectors: ["ExportDefaultDeclaration"];
}
```

## Behavior and migration notes

This rule has no autofix. Missing required syntax is structural and must be
added intentionally.

Avoid over-broad selectors on large codebases. Start with specific selectors
that map to concrete architecture rules.

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
const x = 1;
```

with options:

```ts
{
    selectors: [
        {
            selector: "ExportNamedDeclaration[source]",
            message: "Files in this folder must re-export from a source module.",
        },
    ],
}
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

Disable this rule if your project prefers optional patterns and does not enforce
required syntax per file.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R063

## Further reading

- [ESLint selectors reference](https://eslint.org/docs/latest/extend/selectors)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
