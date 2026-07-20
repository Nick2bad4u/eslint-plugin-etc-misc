# no-only-tests

Disallow focused test invocations such as `test.only(...)`.

## Targeted pattern scope

This rule inspects call expressions with static test API paths and configured
standalone focused-test function names.

## What this rule reports

The rule reports calls whose static member path starts with a configured test
block and ends in a configured focus method. It also reports direct calls to
configured focused-function aliases.

Unlike the original plugin, this implementation checks actual calls. A binding
or object property merely named `fit` is not reported.

## Why this rule exists

Focused tests silently exclude part of a suite and can let incomplete test runs
reach continuous integration or a release branch.

## ❌ Incorrect

```ts
describe.only("focused suite", () => {});
test.concurrent.only("focused test", () => {});
fit("focused test", () => {});
```

## ✅ Correct

```ts
describe("suite", () => {});
test.skip("skipped test", () => {});
const fit = testFactory;
```

Computed focus properties and object options such as `{ only: true }` are not
reported.

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

- `block` defaults to `describe`, `it`, `context`, `test`, `tape`, `fixture`,
  `serial`, `Feature`, `Scenario`, `Given`, `And`, `When`, and `Then`. A trailing
  `*` enables prefix matching, so `test*` matches `testResource.only(...)`.
- `focus` defaults to `only`.
- `functions` defaults to an empty array. Add aliases such as `fit` and
  `fdescribe` when needed.
- `fix` defaults to `false`. When enabled, the fixer removes a plain,
  non-optional `.focus` segment. Optional chains and other ambiguous forms are
  reported without a fix.

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
