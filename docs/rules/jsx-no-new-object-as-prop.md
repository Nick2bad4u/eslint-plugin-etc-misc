# jsx-no-new-object-as-prop

Disallow render-local object allocations passed through JSX props.

## Targeted pattern scope

This rule reports object literals and unshadowed `Object()` or `new Object()` allocations used as JSX prop values inside a function or class render scope. `Object` calls are reported only when they have no argument or a statically primitive argument; an unknown or object-valued argument may be returned unchanged. The rule follows logical and conditional branches and resolves a single same-function `const` initializer.

Module constants and mutable bindings are not traced. Intrinsic JSX attributes can be exempted by name; custom-component props remain in scope.

## What this rule reports

A fresh object reference can defeat shallow prop comparisons or retrigger identity-sensitive consumers. Creating an object during render is otherwise ordinary JavaScript and is not automatically a defect.

## Why this rule exists

Object identity is observable by shallow comparisons, dependency arrays, and some component APIs. The rule highlights new identities where a project has chosen to make that cost explicit.

## ❌ Incorrect

```tsx
function Card() {
 return <Panel options={{ dense: true }} />; // New object identity every render.
}
```

```tsx
function Card() {
 const options = { dense: true };
 return <Panel options={options} />; // The local const does not make it stable.
}
```

## ✅ Correct

```tsx
const panelOptions = { dense: true };

function Card() {
 return <Panel options={panelOptions} />;
}
```

```tsx
function Card({ options }: { options: PanelOptions }) {
 return <Panel options={options} />;
}
```

## Behavior and migration notes

This rule reports only. Hoisting an object or adding `useMemo` can be wrong when its properties depend on render inputs.

React Compiler can automatically memoize values and components in supported builds. Enable this opt-in rule only for boundaries where stable identity is intentional and measured. It is included by both the `all` and `allStrict` presets.

### Options

```ts
interface Options {
 nativeAllowList?: "all" | readonly string[];
}
```

Default: `{}`

`nativeAllowList` ignores case-insensitive attribute names on intrinsic JSX elements. `"all"` ignores all intrinsic attributes.

```tsx
// config: { nativeAllowList: ["style"] }
function Card() {
 return <section style={{ display: "grid" }} />; // Allowed intrinsic attribute.
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/jsx-no-new-object-as-prop": "warn",
  },
 },
];
```

## When not to use it

Disable this rule when consumers do not rely on prop identity, when inline objects improve clarity without measured cost, or when React Compiler owns memoization.

## Package documentation

The rule is a clean-room implementation informed by [`eslint-plugin-react-perf`](https://github.com/cvazac/eslint-plugin-react-perf). This implementation does not generate memoization fixes.

> **Rule catalog ID:** R019

## Further reading

- [React: memo](https://react.dev/reference/react/memo)
- [React: useMemo](https://react.dev/reference/react/useMemo)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review whether stable identity is observable before lifting or memoizing values.
