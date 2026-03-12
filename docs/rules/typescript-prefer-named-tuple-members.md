# typescript/prefer-named-tuple-members

Prefer explicit names for tuple members in TypeScript tuple types.

## Targeted pattern scope

This rule targets tuple type members that are not named:

- standard tuple members (for example `[string, number]`)
- optional tuple members (for example `[string?]`)
- rest tuple members (for example `[...string[]]`)

It does not report tuples where all members are already named.

## What this rule reports

This rule reports tuple types that contain one or more unnamed members.

## Why this rule exists

Named tuple members improve readability and API clarity, especially when tuple
positions have semantic meaning.

## ❌ Incorrect

```ts
type RGB = [number, number, number];

type Pair = [id: string, number?];

type Params = [...string[]];
```

## ✅ Correct

```ts
type RGB = [red: number, green: number, blue: number];

type Pair = [id: string, value?: number];

type Params = [...rest: string[]];
```

## Behavior and migration notes

This rule is autofixable and also provides suggestions.

For unnamed members, the fixer generates deterministic placeholder names:

- `item1`, `item2`, `item3`, ...
- optional members become `itemN?: Type`
- rest members become `...itemN: Type[]`

You can keep the generated names or refine them to domain-specific names.

### Options

This rule has no options.

## Additional examples

```ts
type Point = [number, number];
// ❌ reported

type Point = [x: number, y: number];
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
    {
        plugins: { "etc-misc": etcMisc },
        rules: {
            "etc-misc/typescript/prefer-named-tuple-members": "warn",
        },
    },
];
```

## When not to use it

Disable this rule if your team intentionally prefers positional tuples without
member names.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R099

## Further reading

- [TypeScript Handbook: Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
- [TypeScript 4.0: Named Tuple Members](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#named-tuple-elements)
