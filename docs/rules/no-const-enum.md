# no-const-enum

Disallow TypeScript `const enum` declarations.

## Rule Details

This rule reports `const enum` declarations. `const enum` relies on TypeScript-specific inlining behavior and can cause compatibility issues in mixed toolchains.

### ❌ Incorrect

```ts
const enum Status {
    Ready,
    Running,
}
```

### ✅ Correct

```ts
enum Status {
    Ready,
    Running,
}
```

## Options

```ts
type Options = {
    allowLocal?: boolean;
};
```

Default: `{ allowLocal: false }`

### `allowLocal`

When `true`, non-exported `const enum` declarations are allowed.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/no-const-enum": ["error", { allowLocal: true }],
        },
    },
];
```

## When Not To Use It

Disable this rule if your project explicitly depends on `const enum` inlining and your build toolchain guarantees consistent handling.

> **Rule catalog ID:** R021

## Further Reading

- [TypeScript Handbook: Const enums](https://www.typescriptlang.org/docs/handbook/enums.html#const-enums)
