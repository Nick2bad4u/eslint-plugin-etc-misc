# require-jsdoc

Require JSDoc comments for configured declaration kinds.

## Targeted pattern scope

This rule checks declaration nodes that are configured via `kinds`, including:

- `function` (`FunctionDeclaration` with an identifier)
- `class` (`ClassDeclaration` with an identifier)
- `method` (`MethodDefinition`, excluding constructors)
- `type` (`TSInterfaceDeclaration`, `TSTypeAliasDeclaration`)
- `arrow-function` (named `const` variable declarators initialized with an
arrow function)

Each targeted declaration must have a leading JSDoc block comment (`/** ... */`).

## What this rule reports

This rule reports declarations of configured `kinds` when they do not have a leading JSDoc block comment.

## Why this rule exists

When teams rely on declarations as API boundaries, missing JSDoc usually means
missing intent, missing parameter semantics, and inconsistent generated docs.
This rule enforces baseline documentation hygiene for selected declaration kinds.

## ❌ Incorrect

```ts
function f() {}
```

with options:

```ts
{ kinds: ["function"] }
```

## ✅ Correct

```ts
/**
 * Convert a domain identifier into a cache key.
 */
function f() {}
```

with options:

```ts
{ kinds: ["function"] }
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`jsdoc/require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md)

## Behavior and migration notes

This rule does not auto-fix because it cannot infer accurate documentation text.

For large repositories, start with a narrower `kinds` set (for example only
`function` and `class`), then add `method`, `type`, and `arrow-function` after
the initial backlog is resolved.

### Options

```ts
type Kind = "arrow-function" | "class" | "function" | "method" | "type";

type Options = {
    kinds?: Kind[];
};
```

### Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`jsdoc/require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md)

## Additional examples

```ts
const identity = <T>(value: T) => value;
```

with options:

```ts
{ kinds: ["arrow-function"] }
```

```ts
/**
 * Return the input value unchanged.
 */
const identity = <T>(value: T) => value;
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/require-jsdoc": ["error", { kinds: ["function"] }],
        },
    },
];
```

## When not to use it

Disable this rule if your project uses external documentation sources (for
example ADRs or API schema files) and intentionally avoids inline JSDoc.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R062

## Further reading

- [eslint-plugin-jsdoc: `require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
