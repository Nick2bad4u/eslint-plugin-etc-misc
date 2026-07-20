# no-unused-imports

Report and remove unused ECMAScript import bindings.

## Targeted pattern scope

This rule filters unused-variable diagnostics to ECMAScript import specifiers
and attaches import-aware removal fixes.

## What this rule reports

This rule adapts `eslint-plugin-unused-imports/no-unused-imports`. It composes
the available `no-unused-vars` implementation, keeps reports for import
specifiers, and adds fixes that remove the unused specifier or the entire import
declaration.

## Why this rule exists

Unused import bindings add noise and can retain unwanted module dependencies,
while generic unused-variable rules cannot safely remove import syntax.

## ❌ Incorrect

```ts
import unused from "package";
import { unusedName, usedName } from "./values";

console.log(usedName);
```

## ✅ Correct

```ts
import { usedName } from "./values";

console.log(usedName);
```

Side-effect-only imports are not bindings and are not reported:

```ts
import "./polyfill";
```

## Behavior and migration notes

The rule forwards the selected `no-unused-vars` rule's options. In TypeScript
projects these are normally the options of `@typescript-eslint/no-unused-vars`.

The automatic fix can remove a whole import declaration. That can change
runtime behavior when importing the module executes required side effects.
Use this rule only when imported modules are side-effect-free or side effects
are represented by explicit side-effect imports.

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
   "etc-misc/no-unused-vars": "warn",
  },
 },
];
```

Enable the companion `no-unused-vars` rule to report non-import variables at a
different severity without duplicate import diagnostics.

## When not to use it

Do not enable automatic unused-import removal when bare import side effects are
not modeled explicitly. Prefer `@typescript-eslint/no-unused-vars` directly if
separate severities for imports and other variables are unnecessary.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R066

## Further reading

### Upstream source

Adapted from
[`eslint-plugin-unused-imports`](https://github.com/sweepline/eslint-plugin-unused-imports).

### Additional resources

- [`@typescript-eslint/no-unused-vars`](https://typescript-eslint.io/rules/no-unused-vars/)
- [MDN: `import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
