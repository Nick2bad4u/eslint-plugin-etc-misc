# no-internal

Disallow usage of symbols tagged with `@internal`.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

APIs marked as `@internal` are implementation details that can change without
notice. Referencing them from external call sites couples your code to unstable
contracts and makes upgrades risky.

This rule reports identifier usages whose resolved TypeScript symbol includes one
or more `@internal` tags.

> ⚠️ This rule requires type information to run.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

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

Review this rule in your codebase with `--fix-dry-run` first, then roll out with autofix in controlled batches.

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
[{}]
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
// Add project-specific examples here when edge cases matter.
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
