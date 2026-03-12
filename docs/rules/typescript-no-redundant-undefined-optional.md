# typescript/no-redundant-undefined-optional

Disallow redundant `undefined` in optional parameter and tuple member union types.

## Targeted pattern scope

This rule targets optional signatures where `undefined` is already implied:

- optional function/method parameters, for example `value?: string | undefined`
- optional tuple members, for example `[value?: string | undefined]`
- optional tuple element syntax, for example `[(string | undefined)?]`

It intentionally does **not** report optional object/class properties, because that
scope is handled by [`consistent-optional-props`](./consistent-optional-props.md).

## What this rule reports

This rule reports optional parameters and tuple members whose type unions include
`undefined` explicitly.

## Why this rule exists

Optional parameters and optional tuple members already include `undefined`
semantics. Keeping `| undefined` in those unions is usually redundant noise that
hurts readability.

## ❌ Incorrect

```ts
function parse(value?: string | undefined) {}

type Pair = [value?: string | undefined];

type MaybeName = [(string | undefined)?];
```

## ✅ Correct

```ts
function parse(value?: string) {}

type Pair = [value?: string];

type MaybeName = [(string)?];
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

The fixer removes `undefined` from the matching union and preserves remaining
constituents in place.

### Options

This rule has no options.

## Additional examples

```ts
function load(id?: string | number | undefined) {
    return id;
}
// ❌ reported

function load(id?: string | number) {
    return id;
}
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/no-redundant-undefined-optional": "warn",
        },
    },
];
```

## When not to use it

Disable this rule if your team intentionally keeps explicit `| undefined` in
optional parameters or tuple members for stylistic consistency.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R092

## Further reading

- [TypeScript Handbook: Optional Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters)
- [TypeScript Handbook: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
