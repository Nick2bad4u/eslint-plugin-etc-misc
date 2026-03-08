# no-t

Disallow single-character generic type parameter names.

This rule helps keep type parameter names self-documenting and easier to read in larger codebases.

## What this rule reports

- Generic type parameters with a single-character name (for example `T`, `U`, `K`).
- Optional: type parameter names that do not use a configured prefix.

## Why this rule exists

Single-character type parameter names are terse but often ambiguous outside tiny local scopes. Descriptive names improve readability and maintenance.

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

## Options

### `prefix`

Type: `string`

When configured, all type parameter names longer than one character must start with the specified prefix.

Example configuration:

```ts
{
    "etc-misc/no-t": ["error", { "prefix": "Type" }]
}
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
