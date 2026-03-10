# no-deprecated

Disallow usage of symbols tagged with `@deprecated`.

## Targeted pattern scope

⚠️ This rule requires type information to run. Configure type-aware linting (`parserOptions.project` or `projectService`) before enabling it.

This rule targets the syntax patterns and AST nodes associated with this rule’s focused convention.

## What this rule reports

Deprecated APIs are still callable in TypeScript unless you add explicit checks.
Using them silently accumulates technical debt and can cause breakage when those
APIs are removed.

This rule reports identifier usages whose resolved TypeScript symbol includes
one or more `@deprecated` tags.

> ⚠️ This rule requires type information to run.

## Why this rule exists

Consistent, explicit patterns improve readability, reduce review friction, and prevent subtle maintenance issues.

## ❌ Incorrect

```ts
/** @deprecated Use `newMethod` instead. */
declare function oldMethod(): void;

oldMethod();
```

```ts
interface Api {
  /** @deprecated Use `nextValue` instead. */
  oldValue: string;
}

declare const api: Api;
console.log(api.oldValue);
```

## ✅ Correct

```ts
declare function newMethod(): void;

newMethod();
```

```ts
/** @deprecated Legacy API retained for compatibility. */
declare function legacyMethod(): void;

// Declaration is allowed. Usage is reported.
```

## Deprecated

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-deprecated`](https://typescript-eslint.io/rules/no-deprecated)

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

Use `ignored` to suppress some deprecated symbols by regular-expression pattern:

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
      "etc-misc/no-deprecated": [
        "warn",
        {
          ignored: {
            "^LegacyMethod$": "name",
            "modules/legacy": "path",
          },
        },
      ],
    },
  },
];
```

### Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-deprecated`](https://typescript-eslint.io/rules/no-deprecated)

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
            "etc-misc/no-deprecated": "error",
        },
    },
];
```

## When not to use it

Disable this rule if your project intentionally relies on deprecated APIs during
a planned migration window and you want to manage those usages manually.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R022

## Further reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)
- [TSDoc: `@deprecated`](https://tsdoc.org/pages/tags/deprecated/)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
