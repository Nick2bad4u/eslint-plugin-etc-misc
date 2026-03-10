# no-foreach

Disallow calling `forEach` on configured collection types.

## Targeted pattern scope

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

This rule reports `.forEach(...)` calls for configured type names (by default: `Array`, `Map`, `NodeList`, and `Set`). In codebases that standardize on explicit loops, `for...of` improves control-flow clarity (for example, with `break`, `continue`, and `return`).

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

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

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

### Options

```ts
type Options = {
    types?: string[];
};
```

Default: `{ types: ["Array", "Map", "NodeList", "Set"] }`

### `types`

Use this option to control which type names are checked.

## Additional examples

```ts
// Add project-specific examples here when edge cases matter.
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
