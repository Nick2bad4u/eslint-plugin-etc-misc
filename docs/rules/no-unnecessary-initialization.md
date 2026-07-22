# no-unnecessary-initialization

Disallow unnecessary initialization to `undefined`.

## Targeted pattern scope

This rule checks for explicit `undefined` initializers in two places:

- `let` and `var` declarators with identifier bindings (`let value = undefined;`), and
- class property definitions (`field = undefined;`).

Only direct identifier `undefined` is matched. `const` declarations and
destructuring bindings are excluded because deleting their initializers would
produce invalid syntax.

## What this rule reports

This rule reports eligible variables and class fields explicitly initialized
with `undefined`.

## Why this rule exists

Initializing to `undefined` is usually redundant in JavaScript/TypeScript.
Removing these initializers makes intent clearer and avoids unnecessary syntax.

## ❌ Incorrect

```ts
let value = undefined;
class C {
 field = undefined;
}
```

## ✅ Correct

```ts
let value: number | undefined;
class C {
 field?: number;
}

// Allowed because a const declaration requires an initializer.
const sentinel = undefined;
```

## Behavior and migration notes

This rule autofixes reports by deleting `= undefined`. It deliberately skips
declarations for which that deletion would produce invalid JavaScript or
TypeScript.

### Options

This rule has no options.

## Additional examples

```ts
let cache = undefined;
// ❌ reported

let cache: string | undefined;
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-unnecessary-initialization": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project prefers explicit `undefined` initializers for clarity.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R063

## Further reading

- [MDN: `undefined`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
