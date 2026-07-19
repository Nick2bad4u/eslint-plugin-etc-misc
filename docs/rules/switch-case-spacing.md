# switch-case-spacing

Enforce consistent spacing and break placement in switch cases.

## Targeted pattern scope

This rule inspects each `SwitchCase` body and enforces a specific structure for
non-empty cases.

For non-empty cases, it expects:

- the first consequent statement starts on a later line than `case ...:`; and
- the case ends with `break`, unless the case body starts with a block statement.

## What this rule reports

This rule reports switch case bodies that do not match the expected spacing/break style.

## Why this rule exists

This rule enforces a strict legacy switch layout policy to keep case bodies
visually consistent.

## ❌ Incorrect

```ts
switch (x) {
 case 1:
  foo();
}
```

## ✅ Correct

```ts
switch (x) {
 case 1: {
  foo();
 }
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@stylistic/switch-colon-spacing`](https://eslint.style/rules/switch-colon-spacing)

## Behavior and migration notes

This rule is deprecated in favor of `@stylistic/switch-colon-spacing`.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
switch (status) {
 case "ok":
  doWork();
  break;
 // ❌ first statement is on same line as `case`

 case "done":
  doWork();
  break;
 // ✅ valid
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/switch-case-spacing": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your switch formatting is handled by a different style policy.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R075

## Further reading

- [@stylistic/switch-colon-spacing](https://eslint.style/rules/switch-colon-spacing)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
