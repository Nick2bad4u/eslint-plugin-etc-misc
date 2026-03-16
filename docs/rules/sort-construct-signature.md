# sort-construct-signature

Require construct signatures to be the first member in interfaces.

## Targeted pattern scope

This rule targets `TSConstructSignatureDeclaration` nodes that are not the
first child in an interface body.

## What this rule reports

This rule reports interface construct signatures when they are not the first member in the interface body.

## Why this rule exists

Putting construct signatures first gives constructor-like interfaces a
predictable shape.

## ❌ Incorrect

```ts
interface I {
 x: string;
 new (): string;
}
```

## ✅ Correct

```ts
interface I {
 new (): string;
 x: string;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is mechanical: move construct signatures above other interface
members.

### Options

This rule has no options.

## Additional examples

```ts
interface Factory {
 id: string;
 new (): FactoryInstance;
}
// ❌ construct signature is not first

interface FactoryFixed {
 new (): FactoryInstance;
 id: string;
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
   "etc-misc/sort-construct-signature": "error",
  },
 },
];
```

## When not to use it

Disable this rule if interface member order is not important in your style guide.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R068

## Further reading

- [TypeScript Handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
