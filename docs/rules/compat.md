# compat

Report web APIs that are unsupported by the project's target browsers.

## Targeted pattern scope

This rule targets references to browser APIs tracked by the upstream
compatibility dataset.

## What this rule reports

This rule adapts the maintained
[`eslint-plugin-compat`](https://github.com/amilajack/eslint-plugin-compat)
implementation. It resolves targets from Browserslist and checks referenced web
APIs against compatibility data. Locally declared identifiers, guarded uses,
and configured polyfills are respected by the upstream implementation.

## Why this rule exists

A declared browser-support policy is ineffective if source code uses APIs that
those targets do not implement.

## ❌ Incorrect

```ts
// With IE 11 in the target browsers:
fetch("/api/data"); // ❌ unsupported
```

## ✅ Correct

```ts
if (typeof fetch === "function") {
 fetch("/api/data"); // ✅ guarded
}
```

## Behavior and migration notes

### Configuration

The optional string argument is a Browserslist query. Without it, the rule uses
the repository's normal Browserslist configuration.

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/compat": ["error", "defaults and not IE 11"],
  },
  settings: {
   polyfills: ["Promise", "fetch"],
  },
 },
];
```

The rule reports only; compatibility findings cannot be safely autofixed.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/compat": "error",
  },
 },
];
```

## When not to use it

Disable this rule for server-only code or projects that do not publish a stable
browser support policy. Do not list an API as a polyfill unless it is actually
loaded before application code.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R004

## Further reading

- [`eslint-plugin-compat` README](https://github.com/amilajack/eslint-plugin-compat#readme)
- [Browserslist](https://github.com/browserslist/browserslist)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review findings against the project's actual browser and polyfill policy.
