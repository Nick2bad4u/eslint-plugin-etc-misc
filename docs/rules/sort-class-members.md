# sort-class-members

Enforce alphabetical sorting of class members.

## Targeted pattern scope

This rule inspects `ClassBody` members and checks alphabetical order of member
names.

Supported sortable keys:

- identifier keys (`foo`)
- string literal keys (`"foo"`)

Members with unsupported/computed names are skipped.

## What this rule reports

This rule reports the first class member that appears out of alphabetical order.

## Why this rule exists

Alphabetical member ordering can reduce merge conflicts and make large classes
more predictable to scan.

## ❌ Incorrect

```ts
class Example {
 zebra(): void {}
 alpha(): void {}
}
```

## ✅ Correct

```ts
class Example {
 alpha(): void {}
 zebra(): void {}
}
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v4.0.0`
- **Use instead:** [`sort-class-members/sort-class-members`](https://www.npmjs.com/package/eslint-plugin-sort-class-members) or [Perfectionist sorting rules](https://perfectionist.dev/)

## Behavior and migration notes

This rule is deprecated in favor of dedicated sorting plugins.

It reports only and does not provide an autofix.

### Options

This rule has no options.

### Status

Use the **Deprecated** section above for lifecycle details.

## Additional examples

```ts
class Tokens {
 "a-token" = "#000";
 "z-token" = "#fff";
}
// ✅ valid

class WithComputed {
 [dynamicKey](): void {}
 alpha(): void {}
}
// computed member names are not directly sortable by this rule
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/sort-class-members": "error",
  },
 },
];
```

## When not to use it

Disable this rule if class member order is semantic (lifecycle grouping,
public/private sections) rather than lexical.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R091

## Further reading

- [eslint-plugin-sort-class-members](https://www.npmjs.com/package/eslint-plugin-sort-class-members)
- [Perfectionist sorting rules](https://perfectionist.dev/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
