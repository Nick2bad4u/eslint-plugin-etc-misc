# no-single-line-comment

Disallow `//` comments and require block comments instead.

## Targeted pattern scope

This rule targets all line comments (`// ...`) in source files.

## What this rule reports

This rule reports line comments unless they are directive comments that are
explicitly allowed by configuration.

## Why this rule exists

Single-line comments are easy to accumulate as stale notes and are harder to
format consistently in long explanations. This rule reports line comments and
encourages block comments.

## ❌ Incorrect

```ts
// update this later
const value = 1;
```

## ✅ Correct

```ts
/* update this later */
const value = 1;
```

## Behavior and migration notes

```ts
type Options = [
    {
        allowDirectiveComments?: boolean;
    }?,
];
```

Default:

```ts
[{ allowDirectiveComments: true }]
```

When `allowDirectiveComments` is `true`, comments such as
`// eslint-disable-next-line ...` and `// @ts-expect-error` are allowed.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-single-line-comment": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your team standardizes on `//` comments for short inline
notes.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R042

## Further reading

- [ESLint comment directives](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments)
- [TypeScript: `@ts-expect-error`](https://www.typescriptlang.org/tsconfig#suppressExcessPropertyErrors)
