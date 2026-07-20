# no-constructor-state

Discourage assigning a simple initial `state` value in a class constructor.

## Targeted pattern scope

This rule inspects direct constructor-body assignments to `this.state` with a
recursively simple, side-effect-free initializer.

## What this rule reports

The rule reports direct constructor-body `this.state = value` assignments when
`value` is a literal, `undefined`, `Infinity`, `NaN`, or an array/object
recursively composed from those values. Calls, spreads, array holes, and nested
control-flow assignments are excluded.

## Why this rule exists

Simple initial state is clearer as a class field, where its declaration and
initial value are visible together.

## ❌ Incorrect

```ts
class Component {
 constructor() {
  this.state = { ready: false };
 }
}
```

## ✅ Correct

```ts
class Component {
 state = { ready: false };
}
```

Dynamic initialization remains valid:

```ts
class Component {
 constructor() {
  this.state = createInitialState();
 }
}
```

## Behavior and migration notes

This rule never auto-fixes. A class-field suggestion is available only when no
other class fields exist and the assignment is the sole base-constructor
statement, or immediately follows the sole `super()` statement in a derived
constructor.

Moving an assignment to a class field can still change initialization order and
changes assignment semantics to class-field definition semantics. Review the
suggestion, particularly when an inherited setter named `state` exists.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-constructor-state": "warn" },
 },
];
```

## When not to use it

Disable the rule when constructor assignment order or inherited setter behavior
is intentional. The rule is not React-specific and applies to every class with
a `state` property.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R029

## Further reading

### Upstream inspiration

Clean-room modernization of
[`eslint-plugin-no-constructor-bind`](https://github.com/markalfred/eslint-plugin-no-constructor-bind),
which also publishes the original `no-constructor-state` rule.

### Additional resources

- [MDN: public class fields](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Apply suggestions individually and review class initialization order.
