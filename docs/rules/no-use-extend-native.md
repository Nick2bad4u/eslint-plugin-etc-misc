# no-use-extend-native

Disallow usage of non-native members on built-in JavaScript objects.

## Targeted pattern scope

This rule is intentionally conservative and focuses on obvious built-in object shapes such as:

- String/number/boolean/regexp literals.
- Array/object literals.
- `new` expressions for built-ins.
- `String.prototype.<member>` / `Array.prototype.<member>` style accesses.

It does **not** attempt full-flow inference for arbitrary identifiers.

## What this rule reports

This rule helps prevent implicit reliance on monkey-patched native prototypes (for example from legacy libraries that add methods like `String.prototype.green`).

This rule reports member usage on obvious built-in values when the accessed member is not part of the native API.

## Why this rule exists

Relying on extended native objects can make code unpredictable across runtimes, bundling targets, and dependency versions.

## ❌ Incorrect

```ts
const value = "unicorn".green;
```

```ts
const value = [].customFunction();
```

```ts
const value = String.prototype.shortHash();
```

## ✅ Correct

```ts
const value = "unicorn".toUpperCase();
```

```ts
const value = [].map((entry) => entry);
```

```ts
const value = String.prototype.toLowerCase.call("ABC");
```

## Behavior and migration notes

This rule has no options.

### Relationship to ESLint `no-extend-native`

- ESLint core [`no-extend-native`](https://eslint.org/docs/latest/rules/no-extend-native) prevents adding properties to native prototypes.
- This rule prevents consuming non-native members when they appear in code.

Using both rules together gives better protection:

1. Prevent introducing prototype extension.
2. Prevent relying on prototype extension from third-party code.

Original plugin source: [`eslint-plugin-no-use-extend-native`](https://github.com/dustinspecker/eslint-plugin-no-use-extend-native).

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-use-extend-native": "error",
  },
 },
];
```

## When not to use it

- If your project intentionally and explicitly relies on controlled prototype extension.
- If your runtime environment guarantees specific prototype patches and that dependency is accepted in your architecture.

> **Rule catalog ID:** R051

## Further reading

- [ESLint `no-extend-native`](https://eslint.org/docs/latest/rules/no-extend-native)
- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
