# typescript/no-unsafe-object-assign

Disallow `Object.assign` sources that may overwrite readonly target keys.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets calls matching `Object.assign(...)`, resolves the target and
source types, and compares each source's known property and index-signature
keys with readonly target properties and index signatures.

## What this rule reports

This rule reports an `Object.assign` call only when at least one source may
write a readonly key on the target. Merely having an unrelated readonly target
property is not an error.

## Why this rule exists

It prevents `Object.assign` from bypassing readonly contracts without blocking
safe writes to unrelated mutable properties.

## ❌ Incorrect

```ts
type Target = {
 readonly id: string;
 count: number;
};

declare const target: Target;
Object.assign(target, { id: "changed" });
```

## ✅ Correct

```ts
type Target = {
 readonly id: string;
 count: number;
};

declare const target: Target;

Object.assign(target);
Object.assign(target, {});
Object.assign(target, { count: 2 });
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

- Multiple sources are checked and the call is reported at most once.
- Union branches, intersections, optional properties, constrained generics,
  and string, number, or symbol index signatures are analyzed without assuming
  every target key is written.
- An `any` source is treated conservatively because it may provide any key.
- `unknown`, `never`, `null`, `undefined`, and empty sources have no statically
  known write keys.

Prefer an immutable copy when a source intentionally replaces a readonly key.

### Options

This rule has no options.

## Additional examples

```ts
type Target = {
 readonly id: string;
 count: number;
};

declare const target: Target;

Object.assign(target, { count: 1 });
// ✅ valid: count is writable

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

Disable this rule if readonly object mutation via `Object.assign` is intentionally allowed.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R128

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
