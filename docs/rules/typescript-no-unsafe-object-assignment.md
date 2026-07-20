# typescript/no-unsafe-object-assignment

Deprecated compatibility alias for `typescript/no-unsafe-object-assign`.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule is a TypeScript-prefixed alias of
`typescript/no-unsafe-object-assign`.

It delegates to the canonical rule and reports only when an `Object.assign`
source may write a readonly target key.

## What this rule reports

This rule reports the same calls as
[`typescript/no-unsafe-object-assign`](./typescript-no-unsafe-object-assign.md).

## Why this rule exists

The alias remains exported so existing explicit configurations keep working
while consumers migrate to the canonical rule ID.

## ❌ Incorrect

```ts
type Target = { readonly x: number };
const target: Target = { x: 1 };
Object.assign(target, { x: 2 });
```

## ✅ Correct

```ts
type Target = { readonly id: string; count: number };
declare const target: Target;
Object.assign(target, { count: 2 });
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.2.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`typescript/no-unsafe-object-assign`](./typescript-no-unsafe-object-assign.md)

## Behavior and migration notes

This rule reports only and does not provide an autofix. It remains available
for manual compatibility configurations but is excluded from every executable
preset so a preset never enables both IDs.

Replace the alias ID with `etc-misc/typescript/no-unsafe-object-assign`.

### Options

This rule has no options.

## Additional examples

```ts
type Target = { readonly id: string; count: number };
declare const target: Target;
Object.assign(target, { id: "changed" });
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-unsafe-object-assign": "error",
  },
 },
];
```

## When not to use it

Do not enable this alias in new configurations. Configure the canonical rule
instead.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R129

## Further reading

- [`typescript/no-unsafe-object-assign`](./typescript-no-unsafe-object-assign.md)
- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
