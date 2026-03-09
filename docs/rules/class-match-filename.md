# class-match-filename

Require class declarations to match the current filename.

## Rule Details

This rule reports class declarations whose identifier does not exactly match the source filename stem.

### ❌ Incorrect

```ts
// filename: ClassName.ts
export class NotClassName {}
```

### ✅ Correct

```ts
// filename: ClassName.ts
export class ClassName {}
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
            "etc-misc/class-match-filename": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your project intentionally allows class names that do not mirror file names.

> **Rule catalog ID:** R002

## Further Reading

- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
