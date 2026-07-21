# no-only-tests

Disallow focused test invocations such as `test.only(...)`.

## Targeted pattern scope

This rule inspects complete call/member chains, resolves supported test-runner
imports and aliases, and distinguishes their bindings from shadowing locals.

## What this rule reports

The rule reports calls whose static member path starts with a configured test
block and contains a configured focus method. This includes middle-chain forms
such as `test.only.each(...)`. It also reports direct focused functions such as
`fit(...)` and `fdescribe(...)`.

Unlike the original plugin, this implementation checks actual calls. A binding
or object property merely named `fit` is not reported.

## Why this rule exists

Focused tests silently exclude part of a suite and can let incomplete test runs
reach continuous integration or a release branch.

## ❌ Incorrect

```ts
describe.only("focused suite", () => {});
test.concurrent.only("focused test", () => {});
test.only.each([1])("focused parameterized test", () => {});
fit("focused test", () => {});
```

## ✅ Correct

```ts
describe("suite", () => {});
test.skip("skipped test", () => {});
const fit = testFactory;
```

Static computed focus properties are reported without an automatic fix. Object
options such as `{ only: true }` are not member-chain focus APIs and remain out
of scope.

The rule understands named, renamed, namespace, and applicable default imports
from `@jest/globals`, `vitest`, `node:test`, `bun:test`, `@playwright/test`,
`mocha`, `ava`, `qunit`, and `tape`. A local or parameter binding that shadows a
known global/import is ignored. Renaming an ordinary import to `fit` does not
turn it into a focused-test API.

## Behavior and migration notes

```ts
type Options = [
 {
  block?: readonly string[];
  focus?: readonly string[];
  functions?: readonly string[];
  fix?: boolean;
 },
];
```

- `block` defaults to `describe`, `it`, `context`, `test`, `bench`, `suite`,
  `QUnit`, `tape`, `fixture`, `serial`, `Feature`, `Scenario`, `Given`, `And`,
  `When`, and `Then`. A trailing `*` enables prefix matching, so `test*` matches
  `testResource.only(...)`.
- `focus` defaults to `only`.
- `functions` defaults to `fit` and `fdescribe`.
- `fix` defaults to `false`. When enabled, the fixer removes a plain,
  non-optional `.focus` segment even when it occurs in the middle of a chain.
  Optional or computed chains are reported without a fix.

Example configuration:

```ts
{
 block: ["test", "check*"],
 focus: ["only", "focus"],
 functions: ["fit", "fdescribe"],
 fix: false,
}
```

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
 {
  plugins: { "etc-misc": etcMisc },
  rules: { "etc-misc/no-only-tests": "error" },
 },
];
```

## When not to use it

Disable the rule when the test runner already provides an enforced CI guard and
editor-time feedback is unnecessary, or when the configured block names are
used by unrelated APIs.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

> **Rule catalog ID:** R050

## Further reading

### Upstream inspiration

This is a clean-room, typed modernization of
[`eslint-plugin-no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests).

### Additional resources

- [Vitest test filtering](https://vitest.dev/guide/filtering)
- [Playwright `forbidOnly`](https://playwright.dev/docs/api/class-testconfig#test-config-forbid-only)

## Adoption resources

- Start at warning level in CI, then move to error after cleanup.
- Use focused codemods/autofix batches per package or directory.
