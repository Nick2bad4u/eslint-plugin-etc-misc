# no-dom-globals-in-constructor

Disallow browser-only globals during class construction.

## Targeted pattern scope

This rule targets constructor bodies, constructor parameter defaults, instance
field initializers, and immediately invoked functions in those locations.

## What this rule reports

It reports unguarded browser-global references that execute when a class
instance is created.

## Why this rule exists

Constructors and instance field initializers can run during server-side
rendering. Browser-only global access in either location can therefore crash an
SSR request.

## ❌ Incorrect

```ts
class Viewport {
 width = window.innerWidth;

 constructor() {
  this.title = document.title;
 }
}
```

## ✅ Correct

```ts
class Viewport {
 constructor() {
  this.readWidth = () => window.innerWidth;
 }
}
```

Constructor parameter defaults and immediately invoked functions are checked.
Deferred callbacks, static fields, `typeof`-guarded accesses, shadowed locals,
and type-only references are not reported.

## Behavior and migration notes

Review each finding manually and move the access to a client-only lifecycle or
guarded path; this rule does not autofix.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-dom-globals-in-constructor": "error" },
 },
];
```

## When not to use it

Disable this rule for classes that are provably instantiated only in a browser.
The rule reports only because moving initialization can change lifecycle
semantics.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R031

## Further reading

This is a modern lexical-scope rewrite inspired by
[`eslint-plugin-ssr-friendly`](https://github.com/kopiro/eslint-plugin-ssr-friendly).

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review each finding against constructor and field-initialization order.
