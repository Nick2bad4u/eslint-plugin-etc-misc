# no-enum

Disallow TypeScript `enum` declarations.

## Rule Details

This rule reports every `enum` declaration. Enums emit runtime JavaScript and can complicate tree-shaking and interop. In many codebases, literal unions and `as const` objects are easier to reason about and maintain.

### ❌ Incorrect

```ts
enum Status {
    Ready,
    Running,
}
```

### ✅ Correct

```ts
const Status = {
    Ready: "Ready",
    Running: "Running",
} as const;

type Status = (typeof Status)[keyof typeof Status];
```

## Options

This rule has no options.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-enum": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project intentionally standardizes on TypeScript enums and accepts their emitted runtime output.

## Further Reading

- [TypeScript Handbook: Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
