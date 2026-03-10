# export-matching-filename-only

Require filename-matching export to be the only export.

## Targeted pattern scope

This rule collects exports in a file and checks whether one export name matches
the filename-derived expected name.

If that matching export exists **and** the file exports anything else, the
additional exports are reported.

## What this rule reports

Expected export name is derived from filename stem using `format`
(`PascalCase` by default).

When a matching export is present, all non-matching exports in that file are
reported.

Supported extracted named exports include:

- `export { Name }`
- `export class Name {}`
- `export function name() {}`

Default export is tracked as name `default`.

## Why this rule exists

This enforces a single-primary-export convention for modules whose main export
name mirrors the file name.

## ❌ Incorrect

```ts
// filename: UserService.ts
export class UserService {}
export const helper = 1;
// ❌ helper export is reported
```

## ✅ Correct

```ts
// filename: UserService.ts
export class UserService {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

If you rely on utility side-exports, move them to dedicated modules before
enabling this rule at `error`.

### Options

```ts
type Options = [
    {
        format?: "camelCase" | "kebab-case" | "PascalCase";
    },
];
```

Default:

```ts
{ format: "PascalCase" }
```

## Additional examples

```ts
// filename: user-service.ts
// config: { format: "kebab-case" }
export { userService };
// ✅ filename-matching export and no extra exports
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/export-matching-filename-only": "error",
        },
    },
];
```

## When not to use it

Disable this rule if modules are designed to export a public surface with
multiple related symbols from a single file.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R013

## Further reading

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
