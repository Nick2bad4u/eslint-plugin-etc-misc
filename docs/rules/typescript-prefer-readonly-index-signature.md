# typescript/prefer-readonly-index-signature

Require readonly index signatures in TypeScript type declarations.

## Targeted pattern scope

This rule targets writable `TSIndexSignature` nodes.

## What this rule reports

This rule reports index signatures where the `readonly` modifier is missing.

## Why this rule exists

Readonly index signatures communicate immutability intent and reduce accidental
mutation of dictionary-like objects.

## ❌ Incorrect

```ts
interface UserLookup {
 [id: string]: User;
}

type CountByKey = {
 [key: string]: number;
};
```

## ✅ Correct

```ts
interface UserLookup {
 readonly [id: string]: User;
}

type CountByKey = {
 readonly [key: string]: number;
};
```

## Behavior and migration notes

This rule is autofixable. The fixer inserts `readonly` before each reported
index signature.

## Additional examples

```ts
type Cache = {
 [name: string]: string;
};
// ❌ reported

type CacheView = {
 readonly [name: string]: string;
};
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/typescript/prefer-readonly-index-signature": "error",
  },
 },
];
```

## When not to use it

Disable this rule if mutable index signatures are an intentional design choice.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R136

## Further reading

- [TypeScript Handbook: Index Signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)
- [TypeScript Handbook: readonly properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
