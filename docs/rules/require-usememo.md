# require-usememo

Require explicit review of render-local unstable values passed to components or custom hooks and returned from custom hooks.

## Targeted pattern scope

This rule conservatively recognizes object literals, array literals, constructor calls, function expressions, and JSX expressions. It analyzes three boundaries:

- expression-valued props on custom components inside a function or render scope;
- arguments passed to calls whose terminal name follows the `useX` hook convention; and
- unstable values returned by functions named like custom hooks.

A same-function single `const` initializer is followed. Module constants and mutable bindings are not. Calls resolving to `useMemo` or `useCallback` value imports from `react`, `preact/hooks`, or `preact/compat` are treated as stable, including named, namespace, and default import aliases. Local or shadowed lookalikes receive no memo-hook exemption. Custom-hook return analysis covers explicit `return` statements and concise arrow-function bodies.

Intrinsic DOM props are excluded because inline values there do not affect a child component's shallow prop comparison.

## What this rule reports

The rule reports values whose reference changes at a component or custom-hook boundary. Such changes can invalidate memoization or retrigger identity-sensitive effects. They are not automatically incorrect; the diagnostic exists to make a deliberate policy visible.

## Why this rule exists

Reference changes can cross component and hook API boundaries even when the underlying data did not change. The rule gives projects a conservative review point without generating hooks or dependency arrays.

## ❌ Incorrect

```tsx
function Search() {
 return <Results options={{ limit: 10 }} />; // New object identity every render.
}
```

```tsx
function useSearch() {
 return { reset: () => clearSearch() }; // New function returned to every consumer.
}
```

```tsx
function Search() {
 useAnalytics({ screen: "search" }); // New custom-hook argument every render.
 return null;
}
```

## ✅ Correct

```tsx
function Search({ options }: { options: SearchOptions }) {
 return <Results options={options} />;
}
```

```tsx
function useSearch() {
 const reset = useCallback(() => clearSearch(), []);
 return { reset };
}
```

## Behavior and migration notes

This rule reports only. It never inserts `useMemo` or `useCallback` and never guesses a dependency array. An unsafe generated dependency list can create stale values or change behavior.

React Compiler automatically memoizes values in supported builds. This rule is opt-in and included by both the `all` and `allStrict` presets; enable it only where explicit identity policy remains useful.

### Options

```ts
interface Options {
 checkHookCalls?: boolean;
 checkHookReturnObject?: boolean;
 ignoredHookCallsNames?: Readonly<Record<string, boolean>>;
 ignoredPropNames?: readonly string[];
 strict?: boolean;
}
```

Default:

```ts
{
 checkHookCalls: true,
 checkHookReturnObject: false,
 ignoredHookCallsNames: {},
 ignoredPropNames: [],
 strict: false,
}
```

### `checkHookCalls`

Set this to `false` to skip custom-hook argument analysis.

### `checkHookReturnObject`

The default `false` checks unstable property values within a returned object without reporting the outer object itself. Set this to `true` to report the returned object as a single unstable value.

### `ignoredHookCallsNames`

Exact names and minimatch-style globs map to boolean policies. `true` ignores a hook; `false` keeps it in scope. Exact entries take precedence. Common React and TanStack hooks are ignored by default because their argument identity semantics are already defined by those APIs; a user-provided `false` can opt one back in.

```tsx
// config: { ignoredHookCallsNames: { "useGenerated*": true } }
function View() {
 useGeneratedQuery({ id: 1 }); // Allowed by the configured glob.
 return null;
}
```

### `ignoredPropNames`

Lists exact component prop names excluded from analysis.

### `strict`

Set this to `true` to also report calls, member expressions, and tagged templates whose identity cannot be proven stable. Strict mode is intentionally more prone to false positives.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/require-usememo": [
    "warn",
    { ignoredPropNames: ["renderFallback"], strict: false },
   ],
  },
 },
];
```

## When not to use it

Disable this rule when identities are not observable, when profiling does not justify memoization, or when React Compiler provides the desired optimization. Do not enable strict mode without accepting heuristic false positives.

## Package documentation

The rule is a clean-room implementation informed by the public behavior of [`eslint-plugin-react-usememo`](https://github.com/arthurgeron/eslint-plugin-react-usememo). It does not reuse upstream source and intentionally removes its unsafe memoization fixes.

> **Rule catalog ID:** R086

## Further reading

- [React: useMemo](https://react.dev/reference/react/useMemo)
- [React: useCallback](https://react.dev/reference/react/useCallback)
- [React Compiler](https://react.dev/learn/react-compiler)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Confirm identity is observable and derive dependencies manually before memoizing.
