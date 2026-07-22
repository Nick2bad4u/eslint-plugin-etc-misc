# require-usememo-children

Deprecated compatibility alias for [`no-unstable-react-children`](./no-unstable-react-children.md).

## Targeted pattern scope

This alias runs the exact implementation and options of
`no-unstable-react-children`. It checks unstable direct children of custom
components inside function or class render scopes.

## What this rule reports

It reports the same render-local JSX, object, array, function, instance, and
optionally unknown child values as the canonical rule.

## Why this rule exists

The alias preserves existing flat configurations during the v2 migration. New
configurations should use the canonical name so they do not depend on a rule
scheduled for removal.

## ❌ Incorrect

```tsx
function Page() {
 return (
  <MemoizedShell>
   <Header />
  </MemoizedShell>
 );
}
```

## ✅ Correct

```tsx
function Page({ child }: { child: React.ReactNode }) {
 return <MemoizedShell>{child}</MemoizedShell>;
}
```

## Deprecated

This rule was deprecated in v2.0.0, remains available in v3, and is scheduled
for removal in v4.0.0. It uses the same implementation, options, and diagnostics
as the canonical rule.
Rename the rule ID without changing its configuration:

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/require-usememo-children": "off",
   "etc-misc/no-unstable-react-children": "warn",
  },
 },
];
```

See [`no-unstable-react-children`](./no-unstable-react-children.md) for the
full behavior, options, and examples.

## Behavior and migration notes

The alias and canonical rule share one `create` implementation. Do not enable
both IDs: doing so produces duplicate diagnostics. The alias is excluded from
presets.

## When not to use it

Do not add this deprecated ID to a new configuration. Use
`no-unstable-react-children` directly.

## Package documentation

> **Rule catalog ID:** R087

## Further reading

- [`no-unstable-react-children`](./no-unstable-react-children.md)
- [React: Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
