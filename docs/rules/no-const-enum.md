# no-const-enum

Disallow TypeScript `const enum` declarations.

## Targeted pattern scope

This rule inspects `TSEnumDeclaration` nodes and reports when the declaration is
marked `const`.

With `allowLocal: true`, non-exported `const enum` declarations are allowed.

## What this rule reports

This rule reports `const enum` declarations. `const enum` relies on TypeScript-specific inlining behavior and can cause compatibility issues in mixed toolchains.

## Why this rule exists

`const enum` depends on compile-time inlining semantics that can break in mixed
toolchains and isolated transpilation flows.

## ❌ Incorrect

```ts
const enum Status {
 Ready,
 Running,
}
```

## ✅ Correct

```ts
enum Status {
 Ready,
 Running,
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration options:

- convert `const enum` to regular `enum`, or
- replace with `as const` object + union type.

### Options

```ts
type Options = {
 allowLocal?: boolean;
};
```

Default: `{ allowLocal: false }`

### `allowLocal`

When `true`, non-exported `const enum` declarations are allowed.

## Additional examples

```ts
// config: { allowLocal: true }
const enum LocalKind {
 A,
}
// ✅ allowed when not exported

export const enum PublicKind {
 A,
}
// ❌ still reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-const-enum": ["error", { allowLocal: true }],
  },
 },
];
```

## When not to use it

Disable this rule if your project explicitly depends on `const enum` inlining and your build toolchain guarantees consistent handling.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R027

## Further reading

- [TypeScript Handbook: Const enums](https://www.typescriptlang.org/docs/handbook/enums.html#const-enums)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
