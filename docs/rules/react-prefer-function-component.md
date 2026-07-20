# react-prefer-function-component

Require React-style components to use functions when they do not depend on a class-only API.

## Targeted pattern scope

This rule recognizes classes extending imported `Component` or `PureComponent` bindings from React, Preact, or Inferno. It also recognizes classes that contain JSX, using an instance `render` method as the strongest component signal.

By default, classes with `componentDidCatch` or static `getDerivedStateFromError` are allowed because React error boundaries still require a class. JSX-producing utility classes can be allowed separately.

## What this rule reports

The rule reports class components that can usually be represented as function components. Function components align with hooks and avoid class instance lifecycle and binding mechanics.

## Why this rule exists

Function components are the primary modern React model and compose directly with hooks. The rule provides a migration signal while preserving the class-only error-boundary case by default.

## ❌ Incorrect

```tsx
import { Component } from "react";

class Greeting extends Component {
 render() {
  return <p>Hello</p>; // The component does not use a class-only API.
 }
}
```

## ✅ Correct

```tsx
function Greeting() {
 return <p>Hello</p>;
}
```

```tsx
import { Component } from "react";

class ErrorBoundary extends Component {
 componentDidCatch(error: unknown) {
  reportError(error);
 }

 render() {
  return this.props.children;
 }
}
```

## Behavior and migration notes

This rule reports only. A class-to-function conversion can change state initialization, lifecycle timing, instance fields, refs, and error-boundary behavior, so an automatic conversion would be unsafe.

The rule is opt-in and is included by both the `all` and `allStrict` presets.

### Options

```ts
interface Options {
 allowErrorBoundary?: boolean;
 allowJsxUtilityClass?: boolean;
}
```

Default: `{ allowErrorBoundary: true, allowJsxUtilityClass: false }`

### `allowErrorBoundary`

Set this to `false` to report error-boundary classes as well. That is usually appropriate only when another boundary implementation or framework abstraction is available.

### `allowJsxUtilityClass`

Set this to `true` to allow a class that produces JSX outside an instance `render` method and is not known to extend a supported component base.

```tsx
// config: { allowJsxUtilityClass: true }
class IconFactory {
 make() {
  return <span aria-hidden />; // Allowed utility class.
 }
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/react-prefer-function-component": "warn",
  },
 },
];
```

## When not to use it

Disable this rule in codebases that intentionally retain class components, use framework-specific class lifecycles, or cannot migrate classes without compatibility risk.

## Package documentation

The rule is a clean-room implementation informed by the public behavior of [`eslint-plugin-react-prefer-function-component`](https://www.npmjs.com/package/eslint-plugin-react-prefer-function-component). Import analysis and nested-class state are implemented conservatively to avoid treating unrelated `Component` identifiers as React bases.

> **Rule catalog ID:** R082

## Further reading

- [React: Component](https://react.dev/reference/react/Component)
- [React: Reusing logic with custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Migrate classes manually because lifecycle and state semantics are application-specific.
