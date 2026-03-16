# no-internal

Disallow usage of symbols tagged with `@internal`.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule inspects identifier _usages_ and resolves each identifier to a
TypeScript symbol.

If the resolved symbol has one or more `@internal` JSDoc tags, usage is
reported (unless ignored via configuration).

## What this rule reports

APIs marked as `@internal` are implementation details that can change without
notice. Referencing them from external call sites couples your code to unstable
contracts and makes upgrades risky.

This rule reports identifier usages whose resolved TypeScript symbol includes
one or more `@internal` tags.

## Why this rule exists

It prevents accidental dependency on unstable internals that are intentionally
outside a package's supported API surface.

## ❌ Incorrect

```ts
/** @internal */
interface InternalType {
 readonly value: number;
}

const item: InternalType = { value: 42 };
```

```ts
/** @internal Internal function details */
declare function internalFunction(): void;

internalFunction();
```

## ✅ Correct

```ts
interface PublicType {
 readonly value: number;
}

const item: PublicType = { value: 42 };
```

```ts
/** @internal */
interface InternalType {
 readonly value: number;
}

// Declaration is allowed. Only usage is reported.
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

It ignores declaration identifiers and import/export specifier identifiers, and
focuses on usage sites resolved through TypeScript symbol information.

### Options

```ts
type Options = [
 {
  ignored?: Record<string, "name" | "path">;
 }?,
];
```

Default:

```ts
[{}];
```

Use `ignored` to suppress some internal symbols by regular-expression pattern:

- `"name"`: Match against the symbol name.
- `"path"`: Match against the symbol's fully-qualified declaration path.

If an `ignored` key is not a valid regular expression, the rule reports a
configuration error (`invalidIgnorePattern`) instead of silently ignoring it.

Example:

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-internal": [
    "error",
    {
     ignored: {
      "^ExperimentalInternalType$": "name",
      "modules/internal": "path",
     },
    },
   ],
  },
 },
];
```

## Additional examples

```ts
/** @internal Internal helper */
export declare const __internalThing: string;

const value = __internalThing;
// ❌ reported

// config: { ignored: { "^__internalThing$": "name" } }
const ignoredValue = __internalThing;
// ✅ ignored by configuration
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-internal": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally consumes internal contracts and
accepts the maintenance risk from those unstable dependencies.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R028

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)
- [TSDoc: `@internal`](https://tsdoc.org/pages/tags/internal/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
