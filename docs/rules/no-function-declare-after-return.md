# no-function-declare-after-return

Disallow function declarations that appear after a `return` statement in the same block scope.

## Rule details

JavaScript hoists `function` declarations to the top of their enclosing scope,
which means the following code is syntactically valid and runs without errors:

```ts
function publicMethods(obj) {
    if (obj instanceof CustomClass) {
        return {
            get: methodGetter(obj), // ← called before its declaration ❌
        };
    }
    function methodGetter(obj) { // ← declared after the return
        // …
    }
}
```

Even though this works at runtime, it is a readability trap:

- A reader scanning the function top-to-bottom will encounter the call to
  `methodGetter` before they see its definition.
- Newcomers unfamiliar with hoisting may not realize `methodGetter` is even in
  scope at the call site.
- Linters such as `no-unreachable` do not flag this because the declaration is
  not unreachable — it is hoisted.

This rule enforces that every `FunctionDeclaration` is placed **before** any
`ReturnStatement` in the same block scope, making hoisting irrelevant from a
readability perspective.

### Scope boundaries

This rule reports only when the function declaration is a **direct sibling** of
the `return` statement in the same statement list (`BlockStatement` or
`Program`).

- `return` inside `switch` cases is out of scope for this rule.
- Function declarations nested inside later `if`/`try`/`for` blocks are not directly targeted by this rule.

> **Note:** This rule targets only `FunctionDeclaration` nodes. Arrow functions,
> function expressions, generator functions, and async function expressions
> assigned to variables are **not** flagged — those are expression statements and
> are genuinely unreachable. Use `no-unreachable` for those cases.

## ❌ Incorrect

```ts
function outer() {
    return 42;
    function helper() {} // ← 'helper' should be moved before the return
}
```

```ts
function publicMethods(obj) {
    if (obj) {
        return {
            set: methodSetter(obj),
            get: methodGetter(obj),
        };
        function methodSetter(obj) { /* … */ } // ← should be before return
        function methodGetter(obj) { /* … */ } // ← should be before return
    }
}
```

## ✅ Correct

```ts
function outer() {
    function helper() {} // ← declared before the return
    return helper();
}
```

```ts
function publicMethods(obj) {
    function methodSetter(obj) { /* … */ } // ← before the return
    function methodGetter(obj) { /* … */ } // ← before the return
    if (obj) {
        return {
            set: methodSetter(obj),
            get: methodGetter(obj),
        };
    }
}
```

```ts
// Arrow functions and function expressions after return are NOT flagged —
// use no-unreachable for those.
function outer() {
    return 1;
    const arrow = () => {}; // not a FunctionDeclaration — not flagged here
}
```

## Autofix

This rule provides an **autofix**. When triggered, it moves the offending
`FunctionDeclaration` to immediately before the `ReturnStatement`, preserving
the correct indentation level.

When a function declaration has leading comments (including JSDoc), the fixer
moves those comments together with the declaration.

## Options

This rule has no options.

## When not to use it

- If your team relies on intentional hoisting patterns with thorough documentation,
  you may disable this rule.
- If the function declaration lives in a different block scope from the return
  statement (e.g., hoisted to the outer function while the return is inside an
  `if`-block), the fix may require manual review to confirm the intended
  placement.

## Further reading

- [MDN: Function declarations — Hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting)
- [ESLint built-in: `no-unreachable`](https://eslint.org/docs/rules/no-unreachable)

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-function-declare-after-return": "warn",
        },
    },
];
```
