# no-language-mixing

Disallow mixed-language tokens combining latin and non-latin letters.

## Rule Details

This rule reports string and template content where latin and non-latin characters are mixed in one token.

### ❌ Incorrect

```ts
const x1 = "яz";
const x2 = "xyz123абв";
```

### ✅ Correct

```ts
const x = "xyz";
const y = "123";
const z = "абв";
```

## Options

This rule has no options.

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

## When Not To Use It

Disable this rule if mixed-language tokens are expected and accepted in your project.

> **Rule catalog ID:** R030

## Further Reading

- [Unicode Standard](https://www.unicode.org/standard/standard.html)
- [MDN: String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)
