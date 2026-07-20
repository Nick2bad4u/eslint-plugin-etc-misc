# max-identifier-blocks

Restrict identifier complexity to at most four casing blocks.

## Targeted pattern scope

This rule checks identifier names in:

- declaration identifiers (`Identifier.id`), and
- non-shorthand object property keys (`Identifier.key` where shorthand is false).

It counts naming "blocks" by splitting on case transitions and non-alphanumeric
separators.

## What this rule reports

This rule reports identifiers that contain more than four casing blocks (for example, `AaaBbbCccDddEee`).

## Why this rule exists

Long compound identifiers are harder to read and often indicate mixed
concerns in one symbol.

## ❌ Incorrect

```ts
const AaaBbbCccDddEee = 1;
function aaaBbbCccDddEee() {}

const obj = {
 veryLongCompoundIdentifierName: 1,
};
```

## ✅ Correct

```ts
const AaaBbbCccDdd = 1;
function aaaBbbCccDdd() {}
```

## Behavior and migration notes

The block limit is fixed at **4** in the current implementation.

This rule reports only and does not provide an autofix.

### Options

This rule has no options.

## Additional examples

```ts
const parse_http_response_body = true;
// underscore-separated segments are also counted as blocks

const parseHttpBody = true;
// ✅ shorter identifier
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/max-identifier-blocks": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project allows long compound identifier names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R021

## Further reading

- [TypeScript Handbook: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
