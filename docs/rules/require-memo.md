# require-memo

Require exported function components to use explicit React memoization.

> **Deprecated in v2.0.0.** This rule is frozen and remains available through
> v3.0.0. Blanket `memo` requirements are not a sound performance policy and
> conflict with compiler-managed memoization. Remove the rule during migration;
> there is no direct replacement.

## Targeted pattern scope

This rule checks exported PascalCase functions and function-valued variables that directly contain JSX and have at most two parameters. It recognizes named, aliased, default, and namespace imports of `memo` and `forwardRef` from React or `preact/compat`.

An outer `memo(...)` wrapper satisfies the rule. `forwardRef(...)` is unwrapped for component detection but does not itself satisfy the memoization requirement. Non-exported functions, lowercase utilities, functions with more than two parameters, nested-only JSX, and class components are outside the rule's scope.

## What this rule reports

The rule reports exported components without an explicit `memo(...)` boundary. Memoization can skip rendering when props are shallowly equal, but it adds comparison work and does not help when props are always new.

## Why this rule exists

Some projects use explicit memo boundaries as part of their public component contract. The rule makes that convention enforceable while leaving the performance decision to profiling and project policy.

## ❌ Incorrect

```tsx
export function UserCard({ name }: { name: string }) {
 return <article>{name}</article>; // Exported component is not memoized.
}
```

```tsx
import { forwardRef } from "react";

export const Input = forwardRef((props, ref) => (
 <input {...props} ref={ref} /> // forwardRef alone is not memoization.
));
```

## ✅ Correct

```tsx
import { memo } from "react";

export const UserCard = memo(function UserCard({ name }: { name: string }) {
 return <article>{name}</article>;
});
```

```tsx
import { forwardRef, memo } from "react";

export const Input = memo(
 forwardRef((props, ref) => <input {...props} ref={ref} />)
);
```

## Behavior and migration notes

This rule reports only. Adding `memo` automatically can regress performance, obscure component names, or imply a stability guarantee that the component's props do not meet.

React Compiler applies automatic component and value memoization in supported builds, reducing the need for manual `memo`. Enable the legacy rule only when a project intentionally requires explicit memo boundaries while migrating away from that policy.

The rule is deprecated and excluded from the `minimal`, `recommended`, `strict`,
and `strictTypeChecked` presets beginning in v2.0.0. The exhaustive `all` and
`allStrict` presets retain it at warning level through v3.0.0 so existing
configurations can remove the policy without a forced major-version migration.

### Options

```ts
interface Options {
 ignoredComponents?: Readonly<Record<string, boolean>>;
}
```

Default: `{ ignoredComponents: {} }`

`ignoredComponents` accepts exact names and minimatch-style glob patterns. `true` ignores matching components; `false` explicitly keeps them in scope. Exact entries take precedence over patterns.

```tsx
// config: { ignoredComponents: { "Internal*": true } }
export const InternalBadge = () => <span>Internal</span>; // Allowed by the glob.
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/require-memo": ["warn", { ignoredComponents: { "Page*": true } }],
  },
 },
];
```

## When not to use it

Do not use this rule as a blanket performance policy. Disable it when profiling does not justify memoization, when components usually receive unstable props, or when React Compiler owns memoization.

## Package documentation

The rule is a clean-room implementation informed by the public behavior of [`eslint-plugin-react-usememo`](https://github.com/arthurgeron/eslint-plugin-react-usememo). It deliberately omits automatic fixes and does not reuse upstream source.

> **Rule catalog ID:** R084

## Further reading

- [React: memo](https://react.dev/reference/react/memo)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Confirm memoization helps with representative profiling before changing a component.
