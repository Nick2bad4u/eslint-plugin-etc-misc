# no-vulnerable

Disallow regular expressions that are potentially vulnerable to ReDoS (Regular Expression Denial of Service).

## Why this rule is included here

This rule was integrated into `eslint-plugin-etc-misc` to avoid requiring a separate single-rule plugin dependency.

Original plugin source: [`eslint-plugin-redos-detector`](https://github.com/tjenkinson/eslint-plugin-redos-detector).

## Rule details

This rule analyzes regular expression literals and statically-resolvable `RegExp(...)` constructor calls using [`recheck`](https://www.npmjs.com/package/recheck).

Catastrophic backtracking can make an application spend excessive CPU time on crafted inputs. In server contexts, that can become an availability issue.

This rule reports patterns that `recheck` identifies as vulnerable with polynomial or exponential complexity.

## What this rule checks

This rule checks:

- `/(...)/flags` literals.
- `RegExp("...")` and `new RegExp("...", "flags")` when both arguments are statically-known strings.

This rule intentionally skips dynamic patterns/flags it cannot resolve safely at lint time.

## ❌ Incorrect

```ts
const unsafe = /(a+)+$/;
```

```ts
const unsafe = RegExp("(a+)+$");
```

```ts
const unsafe = new RegExp("(a+)+$", "u");
```

## ✅ Correct

```ts
const safe = /^a+$/;
```

```ts
const source = getPatternFromConfig();
const maybeUnsafe = RegExp(source); // Dynamic value: intentionally not analyzed.
```

## Options

```ts
type Options = [
    {
        ignoreErrors?: boolean;
        permittableComplexities?: Array<"polynomial" | "exponential">;
        timeout?: number | null;
    }?,
];
```

### Default options

```ts
{
    ignoreErrors: true,
    permittableComplexities: [],
}
```

### `ignoreErrors`

When `true` (default), analysis failures from `recheck` are ignored.
When `false`, analysis failures are reported.

Analyzer failures include invalid regular expression syntax and backend startup
errors from the `recheck` runtime. On Windows, this rule normalizes the
temporary `RECHECK_JAR` and `RECHECK_BIN` values while invoking `recheck` so an
upstream path-separator bug cannot make Java execute `package.json` instead of
`recheck.jar`.

### `permittableComplexities`

Allows selected vulnerable complexity classes to pass.

For example, to allow polynomial but still report exponential:

```ts
{
    permittableComplexities: ["polynomial"],
}
```

## When not to use it

- If your codebase never handles untrusted input with regexes.
- If lint-time regex analysis cost is unacceptable for your workflow.
- If you prefer running ReDoS scanning as a separate CI security step rather than as an ESLint rule.

## Further reading

- [OWASP: Regular expression Denial of Service (ReDoS)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [`recheck` package](https://www.npmjs.com/package/recheck)
- [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-vulnerable": "error",
        },
    },
];
```
