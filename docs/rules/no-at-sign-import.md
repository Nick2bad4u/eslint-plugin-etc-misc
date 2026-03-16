# no-at-sign-import

Disallow importing exactly from `"@"`.

## Targeted pattern scope

This rule inspects module source strings in imports/exports and reports sources
that match `"@"` exactly.

## What this rule reports

This rule reports source strings that are exactly `"@"`. It is useful when `@` is a namespace root marker and should not be imported as a module by itself.

## Why this rule exists

When `@` is used as a path alias prefix, importing the bare root can be invalid
or ambiguous. This rule blocks that bare specifier.

## ❌ Incorrect

```ts
import value from "@";
```

## ✅ Correct

```ts
import value from "@/feature";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Typical migration is replacing `"@"` with a concrete module path like
`"@/feature"`.

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
 "disallow": ["@"]
}
```

## Additional examples

```ts
export { value } from "@";
// ❌ reported

export { value } from "@/core/value";
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-at-sign-import": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your tooling resolves `"@"` as a valid direct module import.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R017

## Further reading

- [TypeScript `paths` mapping](https://www.typescriptlang.org/tsconfig/#paths)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
