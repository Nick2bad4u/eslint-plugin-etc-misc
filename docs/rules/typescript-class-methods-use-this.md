# typescript/class-methods-use-this

Require non-static class methods to reference `this`.

## Targeted pattern scope

This rule checks non-static class `MethodDefinition` nodes where:

- `kind === "method"` (constructors/getters/setters are excluded),
- the method has a block body,
- the first parameter is **not** `this`, and
- the method body does **not** contain a `ThisExpression`.

## What this rule reports

This rule reports class instance methods that do not use `this` and do not declare a `this` parameter.

## Why this rule exists

Instance methods that do not use instance state are often better expressed as
static methods or standalone functions.

## ❌ Incorrect

```ts
class C {
    method() {
        return 1;
    }
}
```

## ✅ Correct

```ts
class C {
    method() {
        return this;
    }
}
```

```ts
class C {
    method(this: void) {
        return 1;
    }
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/class-methods-use-this`](https://typescript-eslint.io/rules/class-methods-use-this)

## Behavior and migration notes

This rule is deprecated in favor of
`@typescript-eslint/class-methods-use-this`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
class Service {
    static create() {
        return new Service();
    }

    run() {
        return this;
    }
}
// ✅ static methods are outside this rule; instance method uses this
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/class-methods-use-this": "error",
        },
    },
];
```

## When not to use it

Disable this rule if methods that do not reference `this` are acceptable.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R081

## Further reading

- [@typescript-eslint/class-methods-use-this](https://typescript-eslint.io/rules/class-methods-use-this)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
