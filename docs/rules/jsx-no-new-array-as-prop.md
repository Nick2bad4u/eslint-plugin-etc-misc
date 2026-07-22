# jsx-no-new-array-as-prop

Disallow render-local array allocations passed through JSX props.

**Deprecated**

- **Lifecycle:** Deprecated, frozen, and non-recommended.
- **Deprecated since:** `v3.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`no-unstable-react-values`](./no-unstable-react-values.md)

The replacement consolidates JSX, function, array, and object prop stability
checks behind one rule and one intrinsic-element policy. Do not enable both.

## Targeted pattern scope

This rule reports array literals and unshadowed `Array()` or `new Array()` allocations used as JSX prop values inside a function or class render scope. It follows logical and conditional branches and resolves a single same-function `const` initializer.

Module constants, mutable `let` or `var` bindings, and values from another function scope are not traced. The rule checks custom components and intrinsic elements unless an intrinsic attribute is explicitly allowed.

## What this rule reports

A new array has a different reference on every render. That can defeat a memoized child's shallow prop comparison or retrigger an API that treats reference changes as meaningful. The allocation is not inherently a performance problem, so enable this rule only where stable identity is an established contract.

## Why this rule exists

Identity-sensitive consumers cannot distinguish an unchanged render-local array from changed data by reference alone. The rule makes those allocations reviewable at known memoization boundaries.

## ❌ Incorrect

```tsx
function Toolbar() {
 return <Menu items={[]} />; // A new array is passed on every render.
}
```

```tsx
function Toolbar() {
 const items = ["save", "close"];
 return <Menu items={items} />; // The render-local const still changes each render.
}
```

## ✅ Correct

```tsx
const toolbarItems = ["save", "close"];

function Toolbar() {
 return <Menu items={toolbarItems} />; // Module lifetime gives the array stable identity.
}
```

```tsx
function Toolbar({ items }: { items: readonly string[] }) {
 return <Menu items={items} />;
}
```

## Behavior and migration notes

This rule reports only. Moving an array outside a component or wrapping it in `useMemo` can capture the wrong values or add unnecessary memoization, so the rule cannot choose a safe fix.

React Compiler can automatically memoize values and components in supported builds. Treat this rule as an opt-in diagnostic for measured identity-sensitive boundaries, not as a universal React requirement. It is included by both the `all` and `allStrict` presets.

### Options

```ts
interface Options {
 nativeAllowList?: "all" | readonly string[];
}
```

Default: `{ nativeAllowList: "all" }`

`nativeAllowList` ignores case-insensitive attribute names on lowercase intrinsic JSX elements. The default `"all"` keeps the rule focused on component props because intrinsic attributes do not participate in a child component's prop-identity contract. Set it to `[]` to check every intrinsic attribute. Custom components are never affected by this option.

```tsx
// config: { nativeAllowList: ["data-points"] }
function Chart() {
 return <canvas data-points={[]} />; // Allowed intrinsic attribute.
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/jsx-no-new-array-as-prop": "warn",
  },
 },
];
```

## When not to use it

Do not enable this rule merely to remove small allocations. Disable it when child components do not rely on prop identity, when React Compiler owns memoization, or when profiling shows no useful improvement.

## Package documentation

The rule is a clean-room implementation informed by [`eslint-plugin-react-perf`](https://github.com/cvazac/eslint-plugin-react-perf). This implementation deliberately avoids automatic fixes and module-constant false positives.

> **Rule catalog ID:** R017

## Further reading

- [React: memo](https://react.dev/reference/react/memo)
- [React: useMemo](https://react.dev/reference/react/useMemo)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review whether stable identity is observable before lifting or memoizing values.
