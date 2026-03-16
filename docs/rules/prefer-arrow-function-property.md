# prefer-arrow-function-property

Require arrow-function properties when `this` is not required.

## Targeted pattern scope

This rule targets object-literal properties implemented with a function expression
or method shorthand.

## What this rule reports

This rule reports object property functions that do not declare a `this`
parameter and can be represented as arrow-function properties.

## Why this rule exists

Arrow-function properties make `this` behavior explicit: they capture lexical
`this` and avoid accidental rebinding through call-site context. For codebases
that avoid object-method `this` semantics, this rule enforces a consistent,
low-ambiguity style.

## ❌ Incorrect

```ts
const handlers = {
 onClick() {
  return "clicked";
 },
 onHover: function () {
  return "hovered";
 },
};
```

## ✅ Correct

```ts
const handlers = {
 onClick: () => "clicked",
 onHover: () => "hovered",
 withThis(this: void) {
  return "ok";
 },
};
```

## Behavior and migration notes

This rule has no options.

When migrating, convert method shorthand and function-expression properties to
arrow-function properties where `this` is not used. If a function intentionally
uses method-style `this`, keep it as a method and annotate `this` explicitly.

## Additional examples

```ts
const formatter = {
 prefix: "#",
 format(this: { prefix: string }, value: number) {
  return `${this.prefix}${value}`;
 },
};
// ✅ valid: explicit `this` parameter is allowed by this rule

const formatter2 = {
 format(value: number) {
  return String(value);
 },
};
// ❌ reported
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/prefer-arrow-function-property": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your team intentionally prefers method shorthand for
object APIs or relies on method-style `this` semantics.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R055

## Further reading

- [MDN: Arrow function expressions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [TypeScript: `this` parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
