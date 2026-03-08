# no-foreach

Disallow calling `forEach` on configured collection types.

## Rule Details

This rule reports `.forEach(...)` calls for configured type names (by default: `Array`, `Map`, `NodeList`, and `Set`). In many codebases, explicit `for...of` loops are preferred for readability and flow control.

### ❌ Incorrect

```ts
const answers = [42, 54];
answers.forEach((answer) => console.log(answer));
```

### ✅ Correct

```ts
const answers = [42, 54];
for (const answer of answers) {
    console.log(answer);
}
```

## Options

```ts
type Options = {
    types?: string[];
};
```

Default: `{ types: ["Array", "Map", "NodeList", "Set"] }`

### `types`

Use this option to control which type names are checked.

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

## When Not To Use It

Disable this rule if your project intentionally favors iterator callbacks and does not enforce loop-style consistency.

## Further Reading

- [MDN: Array.prototype.forEach()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [MDN: for...of](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/for...of)
