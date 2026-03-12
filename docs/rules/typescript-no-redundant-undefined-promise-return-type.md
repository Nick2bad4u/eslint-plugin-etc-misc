# typescript/no-redundant-undefined-promise-return-type

Disallow redundant `undefined` in `Promise` return value unions for async
functions that deterministically return definitely-defined values.

## Targeted pattern scope

This rule targets `async` functions with:

- an explicit `Promise<...>` return type,
- a `Promise` value type union including `undefined`, and
- a body that deterministically returns a syntactically definitely-defined
  value.

The current deterministic patterns are intentionally conservative:

- expression-bodied async functions returning definitely-defined expressions
- block-bodied async functions with exactly one `return` statement whose
  argument is definitely defined

## What this rule reports

This rule reports cases such as:

- `async (): Promise<string | undefined> => "x"`
- `async function f(): Promise<number | undefined> { return 1; }`

because the implementation deterministically resolves to a defined value,
making `| undefined` in `Promise<T | undefined>` redundant.

## Why this rule exists

`Promise<T | undefined>` communicates that resolved values might be
`undefined`. When async implementations deterministically return defined values,
keeping `| undefined` adds type noise and weakens API clarity.

## ❌ Incorrect

```ts
const read = async (): Promise<string | undefined> => "x";

async function count(): Promise<number | undefined> {
    return 1;
}

class Box {
    async label(): Promise<string | undefined> {
        return "box";
    }
}
```

## ✅ Correct

```ts
const read = async (): Promise<string> => "x";

async function count(): Promise<number> {
    return 1;
}

class Box {
    async label(): Promise<string> {
        return "box";
    }
}
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the `Promise` value union while preserving
remaining union members.

To avoid unsafe assumptions, this rule intentionally does not report complex
control-flow cases where proving deterministic non-`undefined` resolved values
is not trivial.

### Options

This rule has no options.

## Additional examples

```ts
async function read(): Promise<string | undefined> {
    return maybe();
}
// ✅ valid (returned call may resolve to undefined)

async function read(): Promise<string | undefined> {
    const value = "x";
    return value;
}
// ✅ valid (multiple statements in block body are out of conservative scope)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/no-redundant-undefined-promise-return-type": "warn",
        },
    },
];
```

## When not to use it

Disable this rule if your team intentionally keeps explicit
`Promise<T | undefined>` annotations for stylistic consistency, even when
current implementations are deterministically defined.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R095

## Further reading

- [TypeScript Handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TypeScript Handbook: Everyday Types (Union Types)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
