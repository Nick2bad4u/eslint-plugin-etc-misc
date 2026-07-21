# no-dom-globals-in-react-fc

Disallow browser-only globals while rendering React function components.

## Targeted pattern scope

This rule targets uppercase function components, anonymous default exports, and
component functions structurally owned by an uppercase or default-exported
library wrapper, including render-time hook initializers.

## What this rule reports

It reports unguarded browser-global access that can execute during
function-component SSR.

## Why this rule exists

Function components can execute on the server. Reading browser-only state in
their render path can crash SSR or produce hydration mismatches.

The rule recognizes uppercase function declarations and variable names,
anonymous default exports, and functions passed as the first argument through
one or more wrappers whose result is assigned to an uppercase component or
exported as default. This structural ownership supports wrappers such as
`memo`, `forwardRef`, and library-specific `observer` helpers without trusting a
callee name by itself. Lazy initializers passed to `useState`, `useReducer`, and
`useMemo` are part of rendering and are also checked.

## ❌ Incorrect

```tsx
const Header = () => <div>{window.innerWidth}</div>;

const Title = () => {
 const title = useMemo(() => document.title, []);
 return <h1>{title}</h1>;
};
```

## ✅ Correct

```tsx
const Header = () => {
 useEffect(() => {
  document.title = "Ready";
 }, []);

 return <button onClick={() => window.alert("Clicked")} />;
};

export default () => {
 const hasDocument = "document" in globalThis;
 return <h1>{hasDocument ? globalThis.document.title : ""}</h1>;
};
```

Effects, event callbacks, other deferred functions, guarded accesses, shadowed
locals, and lowercase non-component helpers are not reported. Guards may use
direct or `globalThis` `typeof` comparisons, `"name" in globalThis`, or a
predicate stored in a single `const` binding. Mutable or shadowed predicates are
intentionally not trusted. Shared scope, guard, JSX, and execution results are
cached per linted file.

## Behavior and migration notes

Review each finding manually and move the access to an effect or guarded render
path; this rule does not autofix.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-dom-globals-in-react-fc": "error" },
 },
];
```

## When not to use it

Disable this rule for components that are guaranteed to render only on the
client. The rule reports only because deferral strategy is framework-specific.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R034

## Further reading

This is a modern lexical-scope rewrite inspired by
[`eslint-plugin-ssr-friendly`](https://github.com/kopiro/eslint-plugin-ssr-friendly).

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review each finding against the function component's SSR execution path.
