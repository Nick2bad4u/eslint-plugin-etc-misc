# no-unnecessary-template-literal

Disallow template literals that contain no expressions.

## Targeted pattern scope

This rule matches template literals with zero interpolations:

- `` `plain text` ``
- ` ` \`\` (empty template)

It reports only when `expressions.length === 0`. Tagged templates are excluded
because tag functions receive template objects rather than ordinary strings,
so replacing one with a string literal would change behavior or produce invalid
syntax.

## What this rule reports

This rule reports template literals with zero `${...}` expressions.

## Why this rule exists

Expression-free template literals are typically equivalent to normal string
literals but noisier. Requiring plain strings reduces visual overhead.

## ❌ Incorrect

```ts
const x = `value`;
```

## ✅ Correct

```ts
const x = `value ${suffix}`;
```

```ts
const y = "value";
```

```ts
const raw = String.raw`line\nvalue`;
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`unicorn/no-useless-template-literals`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-useless-template-literals.md)

## Behavior and migration notes

This rule is deprecated in favor of `unicorn/no-useless-template-literals`.
Until removal, it autofixes untagged expression-free templates to JSON-escaped
double-quoted strings.

### Options

This rule has no options.

## Additional examples

```ts
const title = `Dashboard`;
// ❌ reported

const title = "Dashboard";
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-unnecessary-template-literal": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally uses expression-free template literals.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R064

## Further reading

- [MDN: Template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
