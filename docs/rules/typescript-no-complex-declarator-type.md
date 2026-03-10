# typescript/no-complex-declarator-type

Disallow complex inferred declarator types without explicit annotation.

## Targeted pattern scope

This rule targets variable declarators whose identifier has no explicit type
annotation.

It is intended to catch complex inferred declarators and prompt an explicit
annotation (or `as const`, where appropriate).

## What this rule reports

This rule reports variable declarators with complex assertions/inference when no explicit type annotation is present.

## Why this rule exists

Complex inferred declarations can obscure the intended variable contract,
especially when assertions are involved.

## ❌ Incorrect

```ts
const value = (() => 1) as (() => number);
```

## ✅ Correct

```ts
const value: () => number = (() => 1) as (() => number);
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is usually adding an explicit annotation to the declarator identifier.

### Options

This rule has no options.

## Additional examples

```ts
const model = {
    run() {
        return 1;
    },
} as {
    run(): number;
};
// ❌ reported without an explicit declarator annotation

const typedModel: { run(): number } = {
    run() {
        return 1;
    },
};
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/no-complex-declarator-type": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project allows complex inferred declarator types without annotations.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R086

## Further reading

- [TypeScript: Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
