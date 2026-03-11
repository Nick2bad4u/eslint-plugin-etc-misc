# typescript/prefer-readonly-property

Require readonly class and interface properties.

## Targeted pattern scope

This rule targets class properties (`PropertyDefinition`) and interface/type
property signatures (`TSPropertySignature`) where `readonly !== true`.

## What this rule reports

This rule reports writable `PropertyDefinition` and `TSPropertySignature` members.

## Why this rule exists

Readonly property declarations make mutation boundaries explicit and reduce
accidental state changes.

## ❌ Incorrect

```ts
class C {
    value: string;
}
```

## ✅ Correct

```ts
class C {
    readonly value: string;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Use it where immutability is the default design policy.

### Options

This rule has no options.

## Additional examples

```ts
interface Settings {
    mode: "dark" | "light";
}
// ❌ reported

interface ReadonlySettings {
    readonly mode: "dark" | "light";
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
            "etc-misc/typescript/prefer-readonly-property": "error",
        },
    },
];
```

## When not to use it

Disable this rule if mutable properties are part of your coding conventions.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R102

## Further reading

- [TypeScript: readonly properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
