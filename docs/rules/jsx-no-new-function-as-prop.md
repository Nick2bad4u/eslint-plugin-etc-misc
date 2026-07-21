# jsx-no-new-function-as-prop

Disallow render-local function allocations passed through JSX props.

## Targeted pattern scope

This rule reports arrow functions, function expressions, `.bind(...)`, and unshadowed `Function()` or `new Function()` allocations used as JSX props inside a function or class render scope. It follows logical and conditional branches and resolves a single same-function `const` initializer.

Module-level callbacks and values passed in from another scope are not reported. Intrinsic attributes can be exempted by name.

## What this rule reports

A new callback reference can defeat a memoized child's shallow comparison or retrigger an identity-sensitive subscription. Inline event handlers are usually correct and readable, so a new function is not inherently a defect.

## Why this rule exists

Some memoized components and subscription APIs treat callback identity as part of their contract. The rule identifies render-local callbacks at those boundaries without claiming that every inline handler is expensive.

## ❌ Incorrect

```tsx
function Form() {
 return <SubmitButton onSubmit={() => save()} />; // New callback every render.
}
```

```tsx
function Form() {
 const submit = function () {
  save();
 };
 return <SubmitButton onSubmit={submit} />; // Still allocated during render.
}
```

## ✅ Correct

```tsx
function Form({ onSubmit }: { onSubmit: () => void }) {
 return <SubmitButton onSubmit={onSubmit} />;
}
```

```tsx
function Form() {
 const submit = useCallback(() => save(), []);
 return <SubmitButton onSubmit={submit} />;
}
```

Use `useCallback` only when the callback's identity matters. It is not a semantic requirement for every handler.

## Behavior and migration notes

This rule reports only. Generating `useCallback` would require dependency analysis and could create stale closures or invalid hook placement.

React Compiler can automatically memoize callbacks and components in supported builds. This opt-in rule is included by both the `all` and `allStrict` presets and should be enabled for measured identity-sensitive boundaries.

### Options

```ts
interface Options {
 nativeAllowList?: "all" | readonly string[];
}
```

Default: `{ nativeAllowList: "all" }`

`nativeAllowList` ignores case-insensitive attribute names on intrinsic JSX elements. The default `"all"` keeps ordinary DOM event handlers out of scope while continuing to check custom components. Set it to `[]` to check every intrinsic attribute, or provide selected names to ignore.

```tsx
// config: { nativeAllowList: ["onClick", "onChange"] }
function Search() {
 return <button onClick={() => openSearch()}>Search</button>; // Allowed DOM handler.
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/jsx-no-new-function-as-prop": "warn",
  },
 },
];
```

## When not to use it

Disable this rule for ordinary inline handlers, when child components are not memoized, when profiling shows no benefit, or when React Compiler owns callback memoization.

## Package documentation

The rule is a clean-room implementation informed by [`eslint-plugin-react-perf`](https://github.com/cvazac/eslint-plugin-react-perf). Unlike unsafe historical implementations, it never inserts hooks or guesses dependencies.

> **Rule catalog ID:** R018

## Further reading

- [React: useCallback](https://react.dev/reference/react/useCallback)
- [React: memo](https://react.dev/reference/react/memo)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review whether stable identity is observable before lifting or memoizing callbacks.
