# no-language-mixing

Disallow mixed-language tokens combining latin and non-latin letters.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports string and template content where latin and non-latin characters are mixed in one token.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

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

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

This rule has no options.

## Additional examples

```ts
// Add project-specific examples here when edge cases matter.
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

> **Rule catalog ID:** R030

## Further reading

- [Unicode Standard](https://www.unicode.org/standard/standard.html)
- [MDN: String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
