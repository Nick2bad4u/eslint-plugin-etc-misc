# no-unused-vars

Report unused non-import variables without duplicating `no-unused-imports`.

## Targeted pattern scope

This rule filters the selected base unused-variable rule to diagnostics outside
ECMAScript import specifiers.

## What this rule reports

This rule adapts `eslint-plugin-unused-imports/no-unused-vars`. It delegates to
the available `no-unused-vars` implementation and filters out import-specifier
diagnostics. Use it with `no-unused-imports` when imports and other variables
need different severities.

## Why this rule exists

Projects often want unused imports to be removable errors while keeping other
unused variables as configurable warnings without duplicate reports.

## ❌ Incorrect

```ts
const unused = 1;

function run(unusedParameter: string): void {}
```

## ✅ Correct

```ts
import unusedImport from "package"; // handled by no-unused-imports

const used = 1;
console.log(used);
```

## Behavior and migration notes

The rule forwards all options from the selected base `no-unused-vars` rule,
including argument, variable, caught-error, destructuring, and ignore-pattern
options. TypeScript projects should disable both the core and
`@typescript-eslint` versions to avoid duplicate diagnostics.

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "no-unused-vars": "off",
   "@typescript-eslint/no-unused-vars": "off",
   "etc-misc/no-unused-imports": "error",
   "etc-misc/no-unused-vars": [
    "warn",
    {
     args: "all",
     argsIgnorePattern: "^_",
    },
   ],
  },
 },
];
```

## When not to use it

Use `@typescript-eslint/no-unused-vars` directly when unused imports do not need
a separate policy. This companion rule intentionally adds no independent
variable analysis.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R067

## Further reading

### Upstream source

Adapted from
[`eslint-plugin-unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports).

### Additional resources

- [`@typescript-eslint/no-unused-vars`](https://typescript-eslint.io/rules/no-unused-vars/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Review each binding manually; removing a declaration can remove side effects.
