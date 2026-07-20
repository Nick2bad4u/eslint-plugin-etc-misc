# typescript/no-boolean-literal-type

Disallow optional boolean literal property types.

## Targeted pattern scope

This rule targets optional interface/type property signatures where the type is
the boolean literal `true` or `false`.

It applies to `TSPropertySignature[optional=true]` with literal boolean type
annotations.

## What this rule reports

This rule reports optional property declarations typed as `true` or `false`.

## Why this rule exists

For optional properties, literal boolean types are usually overly restrictive
and are commonly intended to be `boolean`.

## ❌ Incorrect

```ts
interface Flags {
 on?: true;
}
```

## ✅ Correct

```ts
interface Flags {
 on?: boolean;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is typically replacing `?: true` / `?: false` with `?: boolean`.

### Options

This rule has no options.

## Additional examples

```ts
interface Flags {
 enabled?: false;
}
// ❌ reported

interface FlagsFixed {
 enabled?: boolean;
}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/no-boolean-literal-type": "error",
  },
 },
];
```

## When not to use it

Disable this rule if optional literal booleans are part of your public type contracts.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R112

## Further reading

- [TypeScript: Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
