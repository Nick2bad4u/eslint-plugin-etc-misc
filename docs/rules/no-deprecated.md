# no-deprecated

Disallow usage of symbols tagged with `@deprecated`.

## Status

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@typescript-eslint/no-deprecated`](https://typescript-eslint.io/rules/no-deprecated)

## Rule Details

Deprecated APIs are still callable in TypeScript unless you add explicit checks.
Using them silently accumulates technical debt and can cause breakage when those
APIs are removed.

This rule reports identifier usages whose resolved TypeScript symbol includes
one or more `@deprecated` tags.

> ⚠️ This rule requires type information to run.

### ❌ Incorrect

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

### ✅ Correct

```ts
declare function newMethod(): void;

newMethod();
```

```ts
/** @deprecated Legacy API retained for compatibility. */
declare function legacyMethod(): void;

// Declaration is allowed. Usage is reported.
```

## Options

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

## When Not To Use It

Disable this rule if your project intentionally relies on deprecated APIs during
a planned migration window and you want to manage those usages manually.

> **Rule catalog ID:** R022

## Further Reading

- [TypeScript-ESLint: Typed Linting](https://typescript-eslint.io/getting-started/typed-linting)
- [TSDoc: `@deprecated`](https://tsdoc.org/pages/tags/deprecated/)
