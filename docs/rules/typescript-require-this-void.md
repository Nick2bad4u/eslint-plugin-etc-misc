# typescript/require-this-void

Require `this: void` on static class methods.

## Targeted pattern scope

This rule targets static class methods whose function expression parameters do
not start with `this: void`.

## What this rule reports

This rule reports static class methods that do not declare a `this: void` parameter.

## Why this rule exists

An explicit `this: void` parameter documents that static methods do not depend
on a `this` context.

## ❌ Incorrect

```ts
class C {
    static f() {}
}
```

## ✅ Correct

```ts
class C {
    static f(this: void) {}
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is adding `this: void` as the first static method parameter.

### Options

This rule has no options.

## Additional examples

```ts
class C {
    static parse(this: C, value: string): C {
        return new C();
    }
}
// ❌ reported: first parameter is not `this: void`

class D {
    static parse(this: void, value: string): D {
        return new D();
    }
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
            "etc-misc/typescript/require-this-void": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project does not enforce explicit static-method `this` typing.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R103

## Further reading

- [TypeScript: this parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
