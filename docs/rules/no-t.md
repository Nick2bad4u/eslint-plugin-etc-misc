# no-t

Disallow single-character generic type parameter names.

This rule helps keep type parameter names self-documenting and easier to read in larger codebases.

## Targeted pattern scope

This rule targets type parameter identifiers in generic declarations.

It reports:

- single-character names (for example `T`, `K`, `U`), and
- names with two or more characters that do not start with configured `prefix`
  (when `prefix` is set).

## What this rule reports

- Generic type parameters with a single-character name (for example `T`, `U`, `K`).
- Optional: type parameter names that do not use a configured prefix.

## Why this rule exists

Single-character type parameter names are terse but often ambiguous outside
narrowly scoped declarations. Descriptive names improve readability and
maintenance.

## ❌ Incorrect

```ts
function identity<T>(value: T): T {
 return value;
}
```

## ✅ Correct

```ts
function identity<ValueType>(value: ValueType): ValueType {
 return value;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Adopt in warning mode first, then rename generic parameters to descriptive names
in touched code paths.

### Options

```ts
type Options = [
 {
  prefix?: string;
 }?,
];
```

### Default configuration

```ts
[{}];
```

### `prefix`

Type: `string`

When configured, all type parameter names longer than one character must start with the specified prefix.

Example configuration:

```ts
"etc-misc/no-t": ["error", { prefix: "Type" }];
```

## Additional examples

```ts
// config: { prefix: "Type" }
function map<TypeInput, TypeOutput>(value: TypeInput): TypeOutput {
 return value as unknown as TypeOutput;
}
// ✅ valid

function map<Input, Output>(value: Input): Output {
 return value as unknown as Output;
}
// ❌ reported because names do not start with "Type"
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-t": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally follows short generic naming
conventions (for example, single-letter parameters in mathematical or
algorithm-heavy APIs).

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R059

## Further reading

- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
