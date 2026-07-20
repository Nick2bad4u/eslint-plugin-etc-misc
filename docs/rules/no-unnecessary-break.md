# no-unnecessary-break

Disallow unnecessary trailing `break` statements in `switch` blocks.

## Targeted pattern scope

This rule matches `break` statements that appear in the **last** case of a
`switch` statement.

Specifically, it reports when the final `SwitchCase` ends with `break;`, because
control flow would already exit the switch at that point.

## What this rule reports

This rule reports a `break` statement when it appears in the last `SwitchCase`, where control would already exit the switch.

## Why this rule exists

A trailing `break` in the final case is dead control-flow noise. Removing it
keeps `switch` blocks smaller and easier to scan.

## ❌ Incorrect

```ts
switch (x) {
 case 1:
  break;
 case 2:
  break;
}
```

## ✅ Correct

```ts
switch (x) {
 case 1:
  break;
 case 2:
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Manual migration is typically trivial: delete the final `break;` in the last
case when no additional logic depends on it.

### Options

This rule has no options.

## Additional examples

```ts
switch (status) {
 case "ok":
  handleOk();
  break;
 default:
  handleDefault();
  break; // ❌ unnecessary (last case)
}
```

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

## When not to use it

Disable this rule if your team prefers explicit trailing `break` statements for style consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R062

## Further reading

- [MDN: `switch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
