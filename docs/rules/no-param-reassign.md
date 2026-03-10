# no-param-reassign

Disallow function parameter reassignment outside the first expression statement.

## Targeted pattern scope

This rule checks parameter mutations through:

- assignment expressions (`param = ...`), and
- update expressions (`param++`, `param--`).

It applies only when the target resolves to a parameter variable.

## What this rule reports

This rule reports parameter reassignment except in the first expression statement in the function body.

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

## Behavior and migration notes

This rule reports only and does not provide an autofix.

To migrate, prefer introducing local variables for transformed parameter values.

### Options

This rule has no options.

## Additional examples

```ts
function increment(count: number): number {
    count++;
    // ❌ reported unless this is inside the first expression statement slot
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
