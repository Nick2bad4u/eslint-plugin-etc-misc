# no-constructor-bind

Discourage binding an instance method to `this` in a class constructor.

## Targeted pattern scope

This rule inspects direct constructor-body assignments where a `this` property
is assigned the result of binding the same `this` method to the instance.

## What this rule reports

The rule reports direct constructor-body assignments shaped exactly like:

```ts
this.handle = this.handle.bind(this);
```

The assigned and bound property names must be the same, both properties must be
non-computed, and `this` must be the sole bind argument. Nested assignments and
bindings of another method are ignored.

## Why this rule exists

Constructor binding adds boilerplate and allocates another function while an
instance arrow field can express lexical `this` directly.

## ❌ Incorrect

```ts
class Handler {
 constructor() {
  this.handle = this.handle.bind(this);
 }

 handle(): void {}
}
```

## ✅ Correct

```ts
class Handler {
 handle = (): void => {};
}
```

```ts
class Handler {
 constructor() {
  this.handle = this.other.bind(this); // different properties: not migrated
 }
}
```

## Behavior and migration notes

This rule never auto-fixes. It offers a suggestion only for a concrete,
non-static, non-generator method without decorators or syntax that depends on
method semantics such as `super`, `arguments`, `yield`, or `new.target`.

Even the suggestion is a semantic migration: prototype methods and instance
arrow fields differ in allocation, inheritance, spying, decoration, and
property behavior. Review every suggestion.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-constructor-bind": "warn" },
 },
];
```

## When not to use it

Disable the rule when bound prototype methods are an intentional API or when
class fields are unavailable in the target runtime.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R028

## Further reading

### Upstream inspiration

Clean-room modernization of
[`eslint-plugin-no-constructor-bind`](https://github.com/markalfred/eslint-plugin-no-constructor-bind).

### Additional resources

- [MDN: public class fields](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields)
- [MDN: `Function.prototype.bind`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Apply suggestions individually and review the resulting class-field semantics.
