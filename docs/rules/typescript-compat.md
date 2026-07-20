# typescript/compat

Report web APIs that are unsupported by the project's target browsers.

## Targeted pattern scope

This alias targets the same browser API references as `etc-misc/compat`.

## What this rule reports

It reports the exact compatibility findings produced by `etc-misc/compat`.

## Why this rule exists

The alias provides a migration path for configurations that used the historical
nested rule ID.

## ❌ Incorrect

```ts
// With IE 11 in the target browsers:
fetch("/api/data");
```

## ✅ Correct

```ts
if (typeof fetch === "function") {
 fetch("/api/data");
}
```

## Deprecated

- **Deprecated since:** `v1.3.0`
- **Use instead:** [`etc-misc/compat`](./compat.md)

This rule is a same-plugin compatibility alias. It executes the exact same rule
implementation and accepts the same configuration as `etc-misc/compat`.

## Behavior and migration notes

```ts
// Before
"etc-misc/typescript/compat": "error";

// After
"etc-misc/compat": "error";
```

The historical `eslint-plugin-typescript-compat` performed a related
compatibility check, but its stale type-aware implementation is not copied here.
The maintained `eslint-plugin-compat` adapter provides the supported behavior
for both local rule IDs.

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

Do not add this deprecated alias to new configurations. See
[`compat`](./compat.md) for browser-target, polyfill, and server-only guidance.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R108

## Further reading

- [`eslint-plugin-typescript-compat`](https://github.com/azu/eslint-plugin-typescript-compat)
- [`eslint-plugin-compat`](https://github.com/amilajack/eslint-plugin-compat)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review findings against the project's actual browser and polyfill policy.
