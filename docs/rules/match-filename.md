# match-filename

Require selected declaration names to match filename casing.

## Targeted pattern scope

This rule compares selected declaration identifiers to the current filename
stem.

Default selectors are:

- `ClassDeclaration > Identifier.id`
- `FunctionDeclaration > Identifier.id`
- `TSInterfaceDeclaration > Identifier.id`
- `TSTypeAliasDeclaration > Identifier.id`

You can replace this set with custom selector(s).

## What this rule reports

For each matched identifier, the rule derives an expected filename token from
the identifier name using `format`, plus optional `prefix`/`suffix`.

It then compares that expected value with the current filename stem.

- `match: true` (default) reports when they differ.
- `match: false` reports when they are equal.

## Why this rule exists

This enables strict declaration-to-file naming contracts, which helps keep large
codebases predictable.

## ❌ Incorrect

```ts
// filename: user-service.ts
export function buildClient() {}
// ❌ default format derives "build-client", not "user-service"
```

## ✅ Correct

```ts
// filename: build-client.ts
export function buildClient() {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Adopt safely by first applying it to a narrow selector scope, then broadening
once naming conventions are stable.

### Options

```ts
type Options = [
    {
        format?: "camelCase" | "kebab-case" | "PascalCase";
        match?: boolean;
        prefix?: string;
        selector?: string | string[];
        suffix?: string;
    },
];
```

Default:

```ts
{ format: "kebab-case", match: true }
```

## Additional examples

```ts
// filename: use-user-service.ts
// config: { prefix: "use-", format: "kebab-case" }
export function userService() {}
// ✅ expected stem becomes "use-user-service"
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/match-filename": "error",
        },
    },
];
```

## When not to use it

Disable this rule if files intentionally contain multiple unrelated declarations
or naming is driven by non-code concerns (routing/layout systems, generated
files, etc.).

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R014

## Further reading

- [TypeScript Handbook: Modules](https://www.typescriptlang.org/docs/handbook/modules/introduction.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
