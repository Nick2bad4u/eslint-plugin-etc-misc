# no-dom-globals-in-module-scope

Disallow browser-only globals during module evaluation.

## Targeted pattern scope

This rule targets eager browser-global references in module bodies, static
fields, static blocks, and immediately invoked functions.

## What this rule reports

It reports unguarded references to browser-only globals that execute while a
module is imported.

## Why this rule exists

Module bodies, static fields, and static initialization blocks execute while a
server imports a module. Accessing `window`, `document`, or another browser-only
global there can make server-side rendering fail before any component renders.

## ❌ Incorrect

```ts
const title = document.title;

class Viewport {
 static width = window.innerWidth;
}
```

## ✅ Correct

```ts
const readTitle = () => document.title;

if (typeof window !== "undefined") {
 window.addEventListener("load", initialize);
}

const hasDocument = "document" in globalThis;
if (hasDocument) {
 globalThis.document.title = "Ready";
}
```

Immediately invoked functions inherit module execution and are checked. Deferred
function bodies, instance field initializers, type-only references, shadowed
locals, and statically recognizable availability guards are not reported.

Availability analysis recognizes direct and `globalThis` `typeof` comparisons,
static property checks such as `"document" in globalThis`, and those predicates
stored in a single `const` binding. Mutable predicates and shadowed
`globalThis` bindings are not trusted. Scope, guard, JSX, and execution results
are cached per linted file so repeated references do not repeat whole-tree work.

Both direct references and static `globalThis` properties are checked. The
browser-global set comes from the current `globals` package with Node globals
removed.

## Behavior and migration notes

Review each finding manually and move the access behind an availability guard or
client-only entry point; this rule does not autofix.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-dom-globals-in-module-scope": "error" },
 },
];
```

## When not to use it

Disable this rule in browser-only entry points that are never imported by a
server. The rule reports only because safe deferral depends on application
architecture.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R032

## Further reading

This is a modern lexical-scope rewrite inspired by
[`eslint-plugin-ssr-friendly`](https://github.com/kopiro/eslint-plugin-ssr-friendly).

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review each finding against the code's SSR execution path before changing it.
