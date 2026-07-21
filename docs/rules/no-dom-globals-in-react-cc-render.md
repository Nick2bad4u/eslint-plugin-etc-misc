# no-dom-globals-in-react-cc-render

Disallow browser-only globals while rendering React class components.

## Targeted pattern scope

This rule targets unguarded browser-global references in class `render` methods
that contain JSX, including immediately invoked functions.

## What this rule reports

It reports browser-global access that can execute during class-component SSR.

## Why this rule exists

A class method named `render` that contains JSX can execute on the server.
Reading browser-only state during that render makes output environment-dependent
or crashes SSR.

## ❌ Incorrect

```tsx
class Header extends React.Component {
 render() {
  return <div>{window.innerWidth}</div>;
 }
}
```

## ✅ Correct

```tsx
class Header extends React.Component {
 componentDidMount() {
  document.title = "Ready";
 }

 render() {
  const hasWindow = "window" in globalThis;
  return <div>{hasWindow ? globalThis.window.innerWidth : 0}</div>;
 }
}
```

Immediately invoked functions inside render are checked. Deferred callbacks,
event handlers, guarded accesses, shadowed locals, and render-like methods
without JSX are not reported. Guards may use direct or `globalThis` `typeof`
comparisons, `"name" in globalThis`, or a predicate stored in a single `const`
binding. Mutable or shadowed predicates are intentionally not trusted. Shared
scope, guard, JSX, and execution results are cached per linted file.

## Behavior and migration notes

Review each finding manually and move the access to a client lifecycle or
guarded render path; this rule does not autofix.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-dom-globals-in-react-cc-render": "error" },
 },
];
```

## When not to use it

Disable this rule when class components are never server-rendered. The rule does
not autofix because the correct client lifecycle is application-specific.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R033

## Further reading

This is a modern lexical-scope rewrite inspired by
[`eslint-plugin-ssr-friendly`](https://github.com/kopiro/eslint-plugin-ssr-friendly).

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review each finding against the class component's SSR lifecycle.
