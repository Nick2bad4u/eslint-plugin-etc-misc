# restrict-identifier-characters

Require identifiers to contain only english characters, digits, underscore, or dollar sign.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** ESLint core [`id-match`](https://eslint.org/docs/latest/rules/id-match)

Configure `id-match` with the project's intended ASCII identifier pattern. Its
regular-expression option replaces this rule's fixed character policy.

## Targeted pattern scope

This rule checks all identifier names and reports names containing characters
outside this allowed set:

- ASCII letters (`A-Z`, `a-z`)
- digits (`0-9`)
- underscore (`_`)
- dollar sign (`$`)

## What this rule reports

This rule reports identifiers that include characters outside `$`, latin letters, digits, and `_`.

## Why this rule exists

It enforces ASCII-only identifier naming for repositories that prioritize
uniform tooling behavior and readability across locales.

## ❌ Incorrect

```ts
const абв = 1;
```

## ✅ Correct

```ts
const $x1 = 2;
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration usually involves renaming identifiers and adjusting references.

### Options

This rule has no options.

## Additional examples

```ts
function приветствие(): void {}
// ❌ reported

function greetingMessage(): void {}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/restrict-identifier-characters": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your codebase allows non-latin identifier names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R088

## Further reading

- [MDN: Lexical grammar (Identifiers)](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
