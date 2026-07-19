# sort-call-signature

Require call signatures to be the first member in interfaces.

## Targeted pattern scope

This rule targets interface call signatures that are not the first member in a
`TSInterfaceBody`.

## What this rule reports

This rule reports interface call signatures when they are not the first member in the interface body.

## Why this rule exists

Placing call signatures first gives function-like interfaces a consistent,
discoverable shape.

## ❌ Incorrect

```ts
interface I {
 x: string;
 (): string;
}
```

## ✅ Correct

```ts
interface I {
 (): string;
 x: string;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is mechanical: move call signatures above other members in each
affected interface.

### Options

This rule has no options.

## Additional examples

```ts
interface Factory {
 new (): FactoryInstance;
 (): FactoryInstance;
 version: string;
}
// ❌ call signature is not first

interface FactoryFixed {
 (): FactoryInstance;
 new (): FactoryInstance;
 version: string;
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
   "etc-misc/sort-call-signature": "error",
  },
 },
];
```

## When not to use it

Disable this rule if interface member order is not important in your style guide.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R069

## Further reading

- [TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
