# class-match-filename

Require class declarations to match the current filename.

## Targeted pattern scope

This rule checks **named class declarations** and compares each class name to the
current filename stem.

It targets top-level class declarations in these forms:

- `class Name {}`
- `export class Name {}`
- `export default class Name {}`

Class expressions are not targeted.

## What this rule reports

This rule reports class declarations whose identifier does not exactly match the source filename stem.

## Why this rule exists

Aligning class names with file names improves discoverability and reduces rename
drift during refactors.

## ❌ Incorrect

```ts
// filename: UserService.ts
export class AccountService {}
```

## ✅ Correct

```ts
// filename: UserService.ts
export class UserService {}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration requires renaming either the class identifier or the file stem.

### Options

This rule has no options.

## Additional examples

```ts
// filename: user-service.ts
export default class UserService {}
// ❌ reported (filename stem is "user-service")

// filename: UserService.ts
export default class UserService {}
// ✅ valid
```

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

## When not to use it

Disable this rule if your project intentionally allows class names that do not mirror file names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R002

## Further reading

- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
