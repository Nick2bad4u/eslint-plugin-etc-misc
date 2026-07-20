# consistent-enum-members

Enforce consistent enum member naming/value casing.

## Targeted pattern scope

This rule analyzes TypeScript `TSEnumMember` nodes and validates naming for:

- enum member identifiers (for example `ACTIVE_USER`), and
- string literal member values when provided.

It enforces SCREAMING_SNAKE_CASE in both places.

## What this rule reports

This rule reports enum members when **neither** of these matches
SCREAMING_SNAKE_CASE:

- the member identifier name, or
- the string literal initializer value.

In other words, the current implementation accepts a member if either side is
already SCREAMING_SNAKE_CASE.

## Why this rule exists

Enums often feed API payloads, persistence layers, and feature flags. Mixed
casing (`camelCase`, `PascalCase`, kebab-case) creates drift between modules.
Standardizing enum casing lowers conversion glue and helps grepability.

## ❌ Incorrect

```ts
enum Status {
 pendingApproval = "PENDING_APPROVAL",
 ACTIVE_USER = "active_user",
}
```

## ✅ Correct

```ts
enum Status {
 PENDING_APPROVAL = "PENDING_APPROVAL",
 ACTIVE_USER = "ACTIVE_USER",
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

### Options

This rule has no options.

## Additional examples

```ts
enum EventType {
 USER_CREATED,
 USER_DELETED,
}
```

```ts
enum Permission {
 READ_ONLY = "READ_ONLY",
 READ_WRITE = "READ_WRITE",
}
```

````ts



enum Partial {    USER_CREATED = "user_created",}
// ✅ currently accepted (name matches SCREAMING_SNAKE_CASE)

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/consistent-enum-members": "error",
        },
    },
];
````

## When not to use it

Disable this rule if your project intentionally uses enum names/values that must
mirror external schemas with different casing requirements.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R006

## Further reading

- [TypeScript handbook: `enum`s](https://www.typescriptlang.org/docs/handbook/enums.html)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
