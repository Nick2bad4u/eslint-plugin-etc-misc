# no-sibling-import

Disallow sibling-file imports from the current directory.

## Targeted pattern scope

This rule checks module source strings in:

- `import ... from "..."`
- `export ... from "..."`
- `export * from "..."`
- dynamic `import("...")`

It reports sources matching `./*` by default.

It is built on the same glob-based import-pattern engine as
`disallow-import`.

## What this rule reports

This rule reports source paths that match configured `disallow` glob patterns
and are not exempted by `allow` patterns.

## Why this rule exists

Disallowing sibling imports can enforce stricter layering where modules import
through explicit public boundaries instead of lateral file coupling.

## ❌ Incorrect

```ts
import value from "./source";
```

## ✅ Correct

```ts
import value from "../source";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Default `disallow` is `./*`, but you can override with custom `allow` and
`disallow` patterns.

### Options

```ts
type Options = {
    allow?: string[];
    disallow?: string[];
};
```

Default:

```json
{ "disallow": ["./*"] }
```

## Additional examples

```ts
// default disallow: ["./*"]
export { value } from "./value";
// ❌ reported

export { value } from "../value";
// ✅ valid

await import("./runtime");
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-sibling-import": "error",
        },
    },
];
```

## When not to use it

Disable this rule if sibling imports are part of your module design.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R041

## Further reading

- [minimatch glob pattern reference](https://github.com/isaacs/minimatch)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
