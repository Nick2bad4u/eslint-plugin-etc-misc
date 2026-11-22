# template-literal-format

Enforce newline-boundary formatting for multiline template literals.

## Targeted pattern scope

This rule targets **multiline** template literals only.

It requires the template content to have boundary newlines:

- the first quasi starts with `\n`
- the last quasi ends with `\n`

## What this rule reports

This rule reports multiline template literals that do not start and end on their
own lines.

The rule reports the formatting issue for manual review.

## Why this rule exists

Boundary-newline formatting makes multiline templates more readable and stable
across indentation changes.

## ❌ Incorrect

```ts
const text = `line one
line two`;
```

## ✅ Correct

```ts
const text = `
    line one
    line two
`;
```

## Behavior and migration notes

Adding boundary newlines or changing indentation can change the evaluated string
or the text passed to a template tag. ESLint leaves the template text untouched.

### Options

This rule has no options.

## Additional examples

```ts
const sql = `SELECT *
FROM users`;
// ❌ reported

const sqlNormalized = `
    SELECT *
    FROM users
`;
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/template-literal-format": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your formatter already enforces a different multiline
template style.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R099

## Further reading

- [MDN: Template literals](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review the expected string value or tag behavior before editing each template.
