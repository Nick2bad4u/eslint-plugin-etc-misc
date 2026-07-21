# require-usememo

Deprecated compatibility alias for [`no-unstable-react-values`](./no-unstable-react-values.md).

## Targeted pattern scope

This alias runs the exact implementation and options of
`no-unstable-react-values`. It checks unstable values passed through component
props and custom-hook boundaries.

## What this rule reports

It reports the same render-local object, array, function, JSX, instance, and
optionally unknown values as the canonical rule.

## Why this rule exists

The alias preserves existing flat configurations during the v2 migration. New
configurations should use the canonical name so they do not depend on a rule
scheduled for removal.

## ❌ Incorrect

```tsx
function Search() {
 return <Results options={{ limit: 10 }} />;
}
```

## ✅ Correct

```tsx
function Search({ options }: { options: SearchOptions }) {
 return <Results options={options} />;
}
```

## Deprecated

This rule was deprecated in v2.0.0 and remains available through v3.0.0. It
uses the same implementation, options, and diagnostics as the canonical rule.
Rename the rule ID without changing its configuration:

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/require-usememo": "off",
   "etc-misc/no-unstable-react-values": "warn",
  },
 },
];
```

See [`no-unstable-react-values`](./no-unstable-react-values.md) for the full
behavior, options, and examples.

## Behavior and migration notes

The alias and canonical rule share one `create` implementation. Do not enable
both IDs: doing so produces duplicate diagnostics. The alias is excluded from
presets.

## When not to use it

Do not add this deprecated ID to a new configuration. Use
`no-unstable-react-values` directly.

## Package documentation

> **Rule catalog ID:** R086

## Further reading

- [`no-unstable-react-values`](./no-unstable-react-values.md)
- [React: useMemo](https://react.dev/reference/react/useMemo)
