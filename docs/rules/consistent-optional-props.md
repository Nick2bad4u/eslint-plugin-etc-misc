# consistent-optional-props

Disallow redundant undefined unions on optional properties.

## Targeted pattern scope

This rule targets optional properties that redundantly include `undefined` in
their union type.

Covered nodes include:

- interface/type property signatures (`TSPropertySignature`), and
- class property definitions (`PropertyDefinition`).

## What this rule reports

This rule reports `?` properties whose type union explicitly includes
`undefined`.

Example pattern:

```ts
name?: string | undefined;
```

Because `?` already implies `undefined`, the explicit union member is redundant.

## Why this rule exists

Removing redundant `undefined` unions keeps type declarations smaller and easier
to read.

## ❌ Incorrect

```ts
interface User {
    name?: string | undefined;
}

class Config {
    timeoutMs?: number | undefined;
}
```

## ✅ Correct

```ts
interface User {
    name?: string;
}

class Config {
    timeoutMs?: number;
}
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration is straightforward: remove `| undefined` from optional properties.

### Options

This rule has no options.

## Additional examples

```ts
type Options = {
    verbose?: boolean | undefined;
};
// ❌ reported

type OptionsFixed = {
    verbose?: boolean;
};
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/consistent-optional-props": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your codebase intentionally keeps explicit
`| undefined` unions for documentation style.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R008

## Further reading

- [TypeScript: Optional Properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
