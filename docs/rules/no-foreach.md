# no-foreach

Disallow calling `forEach` on configured collection types.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting
(`parserOptions.project` or `projectService`) before enabling it.

This rule targets member calls to `.forEach(...)` and reports only when the
receiver type matches configured collection names.

## What this rule reports

This rule reports `.forEach(...)` calls for configured type names (by default: `Array`, `Map`, `NodeList`, and `Set`). In codebases that standardize on explicit loops, `for...of` improves control-flow clarity (for example, with `break`, `continue`, and `return`).

## Why this rule exists

Teams that standardize on explicit loops often prefer `for...of` for control
flow clarity (`break`, `continue`, early `return`) and debugger ergonomics.

## ❌ Incorrect

```ts
const answers = [42, 54];
answers.forEach((answer) => console.log(answer));
```

## ✅ Correct

```ts
const answers = [42, 54];
for (const answer of answers) {
    console.log(answer);
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Adopt gradually by enabling as `warn`, then migrating hot paths and shared
utilities to `for...of` before promoting to `error`.

### Options

```ts
type Options = {
    types?: string[];
};
```

Default: `{ types: ["Array", "Map", "NodeList", "Set"] }`

When `Array` is included, `ReadonlyArray` is also treated as matched.

### `types`

Use this option to control which type names are checked.

## Additional examples

```ts
const set = new Set([1, 2, 3]);
set.forEach((value) => console.log(value));
// ❌ reported with default options

const map = new Map<string, number>();
for (const [key, value] of map) {
    console.log(key, value);
}
// ✅ preferred style
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-foreach": ["error", { types: ["Array", "Set"] }],
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally favors iterator callbacks and does not enforce loop-style consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R025

## Further reading

- [MDN: Array.prototype.forEach()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [MDN: for...of](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...of)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
