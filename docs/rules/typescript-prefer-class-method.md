# typescript/prefer-class-method

Prefer class methods over untyped arrow-function class properties.

## Targeted pattern scope

This rule targets class property definitions whose value is an arrow function
and whose property itself has no explicit type annotation.

## What this rule reports

This rule reports class property arrow functions that have no explicit property type annotation.

## Why this rule exists

Method syntax is often clearer for class behavior and avoids extra per-instance
function property declarations.

## ❌ Incorrect

```ts
class C {
    value = () => {};
}
```

## ✅ Correct

```ts
class C {
    value(): void {}
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

A typed function property (for example `x: () => void = () => {}`) is not
reported by this rule.

### Options

This rule has no options.

## Additional examples

```ts
class C {
    handler: () => void = () => {};
}
// ✅ valid (explicit property type annotation)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-class-method": "error",
        },
    },
];
```

## When not to use it

Disable this rule if class-property arrow functions are your preferred pattern.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R102

## Further reading

- [TypeScript: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
