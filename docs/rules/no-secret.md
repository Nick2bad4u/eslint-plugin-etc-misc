# no-secret

Detect hardcoded secrets in code.

## Targeted pattern scope

This rule targets string literals and related literal-like values in source
files.

## What this rule reports

This rule reports values that match secret-like entropy checks or configured
secret patterns.

## Why this rule exists

Hardcoded credentials can leak through source control and build artifacts,
creating serious security risk.

## ❌ Incorrect

```ts
const token = "SECRET_ABCD";
```

## ✅ Correct

```ts
const token = process.env.API_TOKEN;
```

## Behavior and migration notes

This rule forwards options and behavior to
`eslint-plugin-no-secrets/no-secrets`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`no-secrets/no-secrets`](https://github.com/nickdeis/eslint-plugin-no-secrets)
- **Additional recommendation:** Prefer dedicated scanners such as [Secretlint](https://github.com/secretlint/secretlint) or [detect-secrets](https://github.com/Yelp/detect-secrets).

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-secret": "error",
        },
    },
];
```

## When not to use it

Disable this rule only in sanitized fixture directories where false positives
are unavoidable.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R038

## Further reading

- [eslint-plugin-no-secrets](https://github.com/nickdeis/eslint-plugin-no-secrets)
