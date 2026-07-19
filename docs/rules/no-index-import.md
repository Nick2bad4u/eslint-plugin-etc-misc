# no-index-import

Disallow importing directly from `"."`.

## Targeted pattern scope

This rule inspects module source strings and reports sources that are exactly
`"."` by default.

## What this rule reports

This rule reports import and export source strings that are exactly `"."`.

## Why this rule exists

Bare `"."` imports often hide barrel/index dependencies and make module
relationships less explicit.

## ❌ Incorrect

```ts
import value from ".";
export { value } from ".";
```

## ✅ Correct

```ts
import value from "./feature";
export { value } from "./feature";
```

## Behavior and migration notes

This rule reports only and does not provide an autofix.

Migration usually means replacing `"."` with a concrete relative path.

### Options

```ts
type Options = {
 allow?: string[];
 disallow?: string[];
};
```

Default:

```json
{
 "disallow": ["."]
}
```

- `allow`: glob patterns that are exempted.
- `disallow`: override default disallow patterns.

## Additional examples

```ts
const moduleRef = await import(".");
// ❌ reported

const moduleRef = await import("./feature");
// ✅ valid
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: {
   "etc-misc/no-index-import": "error",
  },
 },
];
```

## When not to use it

Disable this rule if your project intentionally uses `"."` barrel imports.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R028

## Further reading

- [Node.js modules: package entry points](https://nodejs.org/api/packages.html#main)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
