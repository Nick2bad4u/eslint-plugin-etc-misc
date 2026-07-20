# no-language-mixing

Disallow mixed-language tokens combining latin and non-latin letters.

## Targeted pattern scope

This rule checks string literals and template literal raw segments.

It reports tokens that mix latin letters with non-latin letters in the same
word-like segment.

## What this rule reports

This rule reports string and template content where latin and non-latin characters are mixed in one token.

## Why this rule exists

Mixed-script tokens can hide confusable text and reduce readability in
internationalized codebases.

## ❌ Incorrect

```ts
const x1 = "яz";
const x2 = "xyz123абв";
```

## ✅ Correct

```ts
const x = "xyz";
const y = "123";
const z = "абв";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migrate by separating scripts per token or using one script consistently.

### Options

This rule has no options.

## Additional examples

```ts
const message = `пользователь id42`;
// ✅ each token is single-script or numeric

const mixed = `пользовательId42`;
// ❌ reported (mixed script token)
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-language-mixing": "error",
  },
 },
];
```

## When not to use it

Disable this rule if mixed-language tokens are expected and accepted in your project.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R045

## Further reading

- [Unicode Standard](https://www.unicode.org/standard/standard.html)
- [MDN: String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
