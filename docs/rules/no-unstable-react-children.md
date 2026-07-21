# no-unstable-react-children

Disallow render-local unstable children passed to custom components.

## Targeted pattern scope

This rule checks direct children of custom components inside a function or class render scope. It reports JSX elements, fragments, object and array literals, constructor calls, and function expressions. A same-function single `const` initializer is followed; module constants and mutable bindings are not.

Text, primitive expressions, identifiers without a render-local constant initializer, imported React or Preact memo-hook results, intrinsic-element children, and module-level JSX are not reported. Memo hooks must resolve to `useMemo` or `useCallback` value imports from `react`, `preact/hooks`, or `preact/compat`; named, namespace, and default aliases are supported, while local or shadowed lookalikes are not exempt.

## What this rule reports

JSX and other complex expressions create a new reference on each render. That can prevent a memoized wrapper from skipping work because its `children` prop changes. Ordinary React composition intentionally creates elements during render, so this rule is an aggressive performance policy rather than a correctness rule.

## Why this rule exists

Memoized wrapper components often receive `children` as their largest unstable prop. The rule lets projects audit that specific boundary when profiling shows skipped wrapper renders would matter.

## ❌ Incorrect

```tsx
function Page() {
 return (
  <MemoizedShell>
   <Header /> {/* New React element object on every render. */}
  </MemoizedShell>
 );
}
```

```tsx
function Page() {
 const child = <Header />;
 return <MemoizedShell>{child}</MemoizedShell>; // Local const is still recreated.
}
```

## ✅ Correct

```tsx
function Page({ child }: { child: React.ReactNode }) {
 return <MemoizedShell>{child}</MemoizedShell>;
}
```

```tsx
function Page() {
 return (
  <main>
   <Header /> {/* Intrinsic parents are outside this rule's scope. */}
  </main>
 );
}
```

## Behavior and migration notes

This rule reports only. Automatically memoizing children would require dependency analysis and can produce stale elements, props, or context.

React Compiler automatically memoizes JSX and values in supported builds. This rule is opt-in and included by both the `all` and `allStrict` presets. Use it only for measured wrapper components whose ability to skip rendering depends on stable children.

### Options

```ts
interface Options {
 strict?: boolean;
}
```

Default: `{ strict: false }`

Set `strict` to `true` to also report calls, member expressions, and tagged templates whose identity cannot be proven stable.

```tsx
// config: { strict: true }
function Page() {
 return <MemoizedShell>{createHeader()}</MemoizedShell>; // Unknown call result is reported.
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-unstable-react-children": "warn",
  },
 },
];
```

## When not to use it

Do not enable this rule for ordinary composition. Disable it when wrapper renders are inexpensive, child identity is irrelevant, profiling shows no benefit, or React Compiler owns memoization.

## Package documentation

The rule is a clean-room implementation informed by the public behavior of [`eslint-plugin-react-usememo`](https://github.com/arthurgeron/eslint-plugin-react-usememo). It does not reuse upstream source or generate hooks.

> **Rule catalog ID:** R159

## Further reading

- [React: Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
- [React: memo](https://react.dev/reference/react/memo)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Confirm child identity is observable before lifting or memoizing the value.
