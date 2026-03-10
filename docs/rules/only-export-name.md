# only-export-name

Restrict exports to configured names.

## Targeted pattern scope

This rule enforces an allow-list of export names.

It checks:

- `ExportDefaultDeclaration` as name `default`
- `ExportNamedDeclaration` names from specifiers, class/function declarations,
  and variable declaration identifiers

For `export { local as publicName }`, the rule validates `publicName`.

## What this rule reports

This rule reports exports whose names are not included in `names`.

## Why this rule exists

This rule is useful for defining strict module contracts (for example,
default-only modules or curated public names).

## ❌ Incorrect

```ts
export const value = 1;
```

with default options (`["default"]`).

## ✅ Correct

```ts
export default 1;
```

or:

```ts
export const value = 1;
```

with options:

```ts
{ names: ["value"] }
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Default allow-list is `['default']`, so named exports are blocked unless
explicitly allowed.

### Options

```ts
type Options = {
    names?: string[];
};
```

Default:

```json
{ "names": ["default"] }
```

## Additional examples

```ts
// config: { names: ["createClient", "default"] }
export function createClient() {}
export default createClient;
// ✅ valid

export const version = "1.0.0";
// ❌ reported unless "version" is added to names

export { buildClient as client };
// checks "client" (exported name), not "buildClient"
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/only-export-name": ["error", { names: ["value"] }],
        },
    },
];
```

## When not to use it

Disable this rule if exported symbol names do not need to be constrained.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R054

## Further reading

- [MDN: export statement](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
