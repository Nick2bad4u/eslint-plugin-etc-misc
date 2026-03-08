# no-unnecessary-break

Disallow unnecessary trailing `break` statements in `switch` blocks.

## Rule Details

This rule reports a `break` statement when it appears in the last `SwitchCase`, where control would already exit the switch.

### ❌ Incorrect

```ts
switch (x) {
    case 1:
        break;
    case 2:
        break;
}
```

### ✅ Correct

```ts
switch (x) {
    case 1:
        break;
    case 2:
}
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
            "etc-misc/no-unnecessary-break": "error",
        },
    },
];
```

## When Not To Use It

Disable this rule if your team prefers explicit trailing `break` statements for style consistency.
