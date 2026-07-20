# no-invalid-jsx-nesting

Disallow deterministic HTML parent and ancestor relationships that the browser parser cannot preserve as written in JSX.

## Targeted pattern scope

This rule checks intrinsic JSX element names such as `p`, `div`, `table`, `tr`, and `td`. It reports three parser-significant cases:

- elements rendered under a direct parent whose HTML parsing mode will insert, move, or discard nodes, such as `tr` directly under `table`;
- descendants that implicitly close or conflict with an ancestor, such as `div` inside `p`; and
- children placed inside void elements such as `img`.

Fragments and direct `map` or `flatMap` render callbacks preserve the surrounding intrinsic-element ancestry. A custom component is a boundary because the rule cannot know which DOM elements that component renders. JSX passed through an attribute is analyzed independently from the receiving element's children.

This is deliberately not a complete HTML content-model validator. A component may return a root element such as `li` or `tr` for a caller to place under the required parent, and conformance-invalid relationships such as `div` under `ul` are not reported when the parser preserves the tree. Attribute-dependent rules, accessibility requirements, and the runtime output of custom components are outside its scope.

## What this rule reports

The rule reports nesting that can cause hydration errors, browser-inserted containers, or a DOM tree that differs from the JSX tree.

## Why this rule exists

JSX syntax can represent trees that the HTML parser cannot construct. Catching those relationships statically prevents silent DOM repair and makes server and client trees more likely to agree.

## ❌ Incorrect

```tsx
function Article() {
 return (
  <p>
   <div>Details</div> {/* A div implicitly closes the paragraph. */}
  </p>
 );
}
```

```tsx
function Results({ rows }: { rows: readonly string[] }) {
 return (
  <table>
   <tr>
    {/* tr requires a tbody, thead, or tfoot parent. */}
    <td>{rows.length}</td>
   </tr>
  </table>
 );
}
```

## ✅ Correct

```tsx
function Article() {
 return (
  <div>
   <p>Summary</p>
   <div>Details</div>
  </div>
 );
}
```

```tsx
function Results({ rows }: { rows: readonly string[] }) {
 return (
  <table>
   <tbody>
    <tr>
     <td>{rows.length}</td>
    </tr>
   </tbody>
  </table>
 );
}
```

## Behavior and migration notes

This rule reports only. It does not move elements or insert containers because the intended layout and semantics cannot be inferred safely.

The rule is opt-in and is included by both the `all` and `allStrict` presets. It does not require type information.

### Options

This rule has no options.

## Additional examples

```tsx
function Item() {
 return <li>Composable list item</li>;
}

function Navigation() {
 return (
  <ul>
   <Item />
  </ul>
 );
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-invalid-jsx-nesting": "error",
  },
 },
];
```

## When not to use it

Disable the rule for non-HTML JSX runtimes whose lowercase elements do not follow browser parsing rules. Do not use it as a substitute for an accessibility linter or full HTML validator.

## Package documentation

The rule is a clean-room implementation informed by the public behavior of [`eslint-plugin-validate-jsx-nesting`](https://www.npmjs.com/package/eslint-plugin-validate-jsx-nesting). Its relationship table is intentionally narrower and focused on deterministic parser behavior.

> **Rule catalog ID:** R044

## Further reading

- [HTML Standard: Parsing HTML documents](https://html.spec.whatwg.org/multipage/parsing.html)
- [React: Validating DOM nesting warnings](https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review the rendered HTML structure manually; the rule does not move elements.
