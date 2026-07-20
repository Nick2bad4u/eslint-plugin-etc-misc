# jsx-no-jsx-as-prop

Disallow render-local JSX allocations passed through JSX props.

## Targeted pattern scope

This rule reports JSX elements and fragments used as prop expressions inside a function or class render scope. It follows logical and conditional branches and resolves a single same-function `const` initializer.

Normal JSX children are not props for this rule and are not reported. Module-level JSX constants are treated as stable. Intrinsic attributes can be exempted by name.

## What this rule reports

A JSX expression creates a new React element object. Passing that object through a prop can defeat shallow comparison when the receiver is memoized and the element is otherwise stable. Composition through `children` is often clearer, but JSX-as-prop APIs can also be intentional.

## Why this rule exists

Element objects participate in reference comparisons just like arrays and objects. The rule exposes JSX-valued props when a component API expects their identities to remain stable.

## ❌ Incorrect

```tsx
function Page() {
 return <Layout header={<Header />} />; // New element object every render.
}
```

```tsx
function Page() {
 const header = <Header />;
 return <Layout header={header} />; // The render-local const is still unstable.
}
```

## ✅ Correct

```tsx
function Page() {
 return (
  <Layout>
   <Header /> {/* Composition is outside this rule's prop-specific scope. */}
  </Layout>
 );
}
```

```tsx
const header = <Header />;

function Page() {
 return <Layout header={header} />;
}
```

## Behavior and migration notes

This rule reports only. Moving JSX outside a component can accidentally freeze props or context, while adding `useMemo` can introduce unnecessary dependencies.

React Compiler can automatically memoize values and components in supported builds. Enable this opt-in rule only when a component API deliberately requires stable element identity. It is included by both the `all` and `allStrict` presets.

### Options

```ts
interface Options {
 nativeAllowList?: "all" | readonly string[];
}
```

Default: `{}`

`nativeAllowList` ignores case-insensitive attribute names on intrinsic JSX elements. `"all"` ignores every intrinsic attribute.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/jsx-no-jsx-as-prop": "warn",
  },
 },
];
```

## When not to use it

Disable this rule for render-prop or slot APIs where JSX-valued props are the intended interface, when receiver identity does not affect rendering, or when React Compiler owns memoization.

## Package documentation

The rule is a clean-room implementation informed by [`eslint-plugin-react-perf`](https://github.com/cvazac/eslint-plugin-react-perf). It intentionally remains outside the recommended preset because JSX-valued props are often valid API design.

> **Rule catalog ID:** R016

## Further reading

- [React: Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
- [React: memo](https://react.dev/reference/react/memo)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review whether stable identity is observable before changing the component API.
