# no-param-reassign

Disallow function parameter reassignment outside the first expression statement.

## Targeted pattern scope

This rule checks parameter mutations through:

- assignment expressions (`param = ...`), and
- update expressions (`param++`, `param--`).

It applies only when the target resolves to a parameter variable.

## What this rule reports

This rule reports parameter reassignment except when it occurs inside the first
`ExpressionStatement` of a function body.

## Why this rule exists

Parameter mutation can obscure function contracts and complicate reasoning about
input values.

## ❌ Incorrect

```ts
function f(value: number) {
    sideEffect();
    value += 1;
}
```

## ✅ Correct

```ts
function f(value: number) {
    value += 1;
    sideEffect();
}
```

```ts
function f(value: number): number {
    const nextValue = value + 1;
    return nextValue;
}
```

```ts
function initialize(value: number) {
    value = normalize(value);
    // ✅ allowed: reassignment occurs in first expression statement
    return value;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

To migrate, prefer introducing local variables for transformed parameter values.

### Options

This rule has no options.

## Additional examples

```ts
function increment(count: number): number {
    doWork();
    count++;
    // ❌ reported: update occurs after the first expression statement
    return count;
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-param-reassign": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase allows unrestricted parameter mutation.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R035

## Further reading

- [MDN: Function parameters](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
