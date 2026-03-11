# typescript/require-prop-type-annotation

Require type annotations for class properties without initializers.

## Targeted pattern scope

This rule targets class `PropertyDefinition` nodes where both are true:

- `typeAnnotation` is missing, and
- `value` is `null` (no initializer).

## What this rule reports

This rule reports class properties that have no initializer and no type annotation.

## Why this rule exists

Uninitialized properties without annotations leave property type intent unclear.

## ❌ Incorrect

```ts
class C {
    value;
}
```

## ✅ Correct

```ts
class C {
    value: string;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is adding explicit property type annotations for uninitialized
declarations.

### Options

This rule has no options.

## Additional examples

```ts
class User {
    name = "anonymous";
    // ✅ valid: initializer provides type

    role;
    // ❌ reported: no initializer and no annotation
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/require-prop-type-annotation": "error",
        },
    },
];
```

## When not to use it

Disable this rule if implicit `any`-style property declarations are allowed.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R105

## Further reading

- [TypeScript: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
