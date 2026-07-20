# decorator-position

Enforce consistent placement of decorators on class properties and methods.

## Targeted pattern scope

This rule targets decorators attached to class properties, auto-accessors, and
methods.

## What this rule reports

This rule checks the last decorator immediately before each decorated class
property, auto-accessor, or method. Properties prefer an inline declaration by
default, while methods require the declaration on the following line.

Multiline decorators and declarations that would exceed `printWidth` are always
expanded. When a decorator matches both override lists, `above` wins.

## Why this rule exists

A single placement policy keeps decorated class APIs readable and prevents
format-only review churn.

## ❌ Incorrect

```ts
class Store {
 @tracked
 value = 0;

 @action increment() {}
}
```

## ✅ Correct

```ts
class Store {
 @tracked value = 0;

 @action
 increment() {}
}
```

## Behavior and migration notes

### Options

```ts
type Alignment = "above" | "prefer-inline";
type Matcher = string | [string, { withArgs: boolean }];

type Options = [
 {
  methods?: Alignment;
  overrides?: {
   above?: Matcher[];
   "prefer-inline"?: Matcher[];
  };
  printWidth?: number;
  properties?: Alignment;
 }?,
];
```

The defaults are:

```ts
[
 {
  methods: "above",
  overrides: { above: [], "prefer-inline": [] },
  printWidth: 100,
  properties: "prefer-inline",
 },
];
```

Matchers may include or omit the leading `@`. A tuple matcher additionally
distinguishes `@decorator` from `@decorator()`.

For a run of decorators, the decorator nearest the class member controls the
placement of the member. Earlier decorators retain their existing layout.

### Autofix safety

The rule only replaces whitespace between the final decorator and the member.
It still reports a violation when a comment occupies that range, but withholds
the fix so the comment cannot be moved or deleted.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/decorator-position": [
    "error",
    {
     overrides: { above: [["inject", { withArgs: true }]] },
     printWidth: 100,
    },
   ],
  },
 },
];
```

## When not to use it

Do not enable this rule if your formatter already owns decorator placement or
your project intentionally permits both layouts.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R012

## Further reading

This rule is a strict TypeScript rewrite inspired by
[`eslint-plugin-decorator-position`](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position).

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
