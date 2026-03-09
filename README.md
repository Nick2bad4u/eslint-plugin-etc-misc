# eslint-plugin-etc-misc

[![npm version.](https://img.shields.io/npm/v/eslint-plugin-etc-misc)](https://www.npmjs.com/package/eslint-plugin-etc-misc)
[![npm downloads.](https://img.shields.io/npm/dm/eslint-plugin-etc-misc)](https://www.npmjs.com/package/eslint-plugin-etc-misc)
[![license.](https://img.shields.io/npm/l/eslint-plugin-etc-misc)](./LICENSE)

Opinionated ESLint plugin that combines and curates rules from `etc` and `misc`
style linting patterns for TypeScript-heavy codebases.

## Installation

```bash
npm install --save-dev eslint-plugin-etc-misc eslint typescript
```

## Usage (Flat Config)

```js
import etcMisc from "eslint-plugin-etc-misc";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    },
    etcMisc.configs.recommended,
];
```

## Presets

- `etcMisc.configs.recommended`
- `etcMisc.configs.all`

## Plugin namespace

Rules are namespaced as `etc-misc/<rule-name>`, for example:

```js
{
    rules: {
        "etc-misc/no-t": "error",
    },
}
```

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend: `🟡 recommended` · `🟣 all`

| Rule | Fix | Preset key |
| --- | :-: | :-- |
| [`array-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/array-type) | 🔧 | 🟣 |
| [`class-match-filename`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/class-match-filename) | — | 🟣 |
| [`comment-spacing`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/comment-spacing) | — | 🟣 |
| [`consistent-empty-lines`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-empty-lines) | — | 🟣 |
| [`consistent-enum-members`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-enum-members) | — | 🟣 |
| [`consistent-filename`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-filename) | — | 🟣 |
| [`consistent-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-import) | — | 🟣 |
| [`consistent-optional-props`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-optional-props) | — | 🟣 |
| [`consistent-source-extension`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-source-extension) | — | 🟣 |
| [`consistent-symbol-description`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-symbol-description) | — | 🟣 |
| [`default-case`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/default-case) | — | 🟣 |
| [`disallow-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/disallow-import) | — | 🟣 |
| [`export-matching-filename-only`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/export-matching-filename-only) | — | 🟣 |
| [`match-filename`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/match-filename) | — | 🟣 |
| [`max-identifier-blocks`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/max-identifier-blocks) | — | 🟣 |
| [`no-assign-mutated-array`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-assign-mutated-array) | — | 🟡 🟣 |
| [`no-at-sign-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-at-sign-import) | — | 🟣 |
| [`no-at-sign-internal-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-at-sign-internal-import) | — | 🟣 |
| [`no-chain-coalescence-mixture`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-chain-coalescence-mixture) | — | 🟣 |
| [`no-commented-out-code`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-commented-out-code) | — | 🟣 |
| [`no-const-enum`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-const-enum) | — | 🟣 |
| [`no-deprecated`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-deprecated) | — | 🟣 |
| [`no-enum`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-enum) | — | 🟣 |
| [`no-expression-empty-lines`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-expression-empty-lines) | 🔧 | 🟣 |
| [`no-foreach`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-foreach) | — | 🟣 |
| [`no-implicit-any-catch`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-implicit-any-catch) | 🔧 💡 | 🟡 🟣 |
| [`no-index-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-index-import) | — | 🟣 |
| [`no-internal`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-internal) | — | 🟡 🟣 |
| [`no-internal-modules`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-internal-modules) | — | 🟣 |
| [`no-language-mixing`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-language-mixing) | — | 🟣 |
| [`no-misused-generics`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-misused-generics) | — | 🟣 |
| [`no-mixed-enums`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-mixed-enums) | — | 🟣 |
| [`no-negated-conditions`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-negated-conditions) | — | 🟣 |
| [`no-nodejs-modules`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-nodejs-modules) | — | 🟣 |
| [`no-param-reassign`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-param-reassign) | — | 🟣 |
| [`no-relative-parent-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-relative-parent-import) | — | 🟣 |
| [`no-restricted-syntax`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-restricted-syntax) | — | 🟣 |
| [`no-secret`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-secret) | — | 🟣 |
| [`no-self-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-self-import) | — | 🟣 |
| [`no-shadow`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-shadow) | — | 🟣 |
| [`no-sibling-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-sibling-import) | — | 🟣 |
| [`no-single-line-comment`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-single-line-comment) | — | 🟣 |
| [`no-t`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-t) | — | 🟡 🟣 |
| [`no-underscore-export`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-underscore-export) | — | 🟣 |
| [`no-unnecessary-as-const`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-as-const) | — | 🟣 |
| [`no-unnecessary-break`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-break) | — | 🟣 |
| [`no-unnecessary-initialization`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-initialization) | — | 🟣 |
| [`no-unnecessary-template-literal`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-template-literal) | — | 🟣 |
| [`no-unused-disable`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unused-disable) | — | 🟣 |
| [`no-useless-generics`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-useless-generics) | 💡 | 🟣 |
| [`no-value-tostring`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-value-tostring) | — | 🟣 |
| [`no-writeonly`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-writeonly) | — | 🟣 |
| [`object-format`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/object-format) | — | 🟣 |
| [`only-export-name`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/only-export-name) | — | 🟣 |
| [`prefer-arrow-function-property`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-arrow-function-property) | — | 🟣 |
| [`prefer-const-require`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-const-require) | — | 🟣 |
| [`prefer-includes`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-includes) | 🔧 💡 | 🟣 |
| [`prefer-interface`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-interface) | 🔧 💡 | 🟣 |
| [`prefer-less-than`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-less-than) | 🔧 💡 | 🟣 |
| [`prefer-object-has-own`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-object-has-own) | 🔧 | 🟣 |
| [`prefer-only-export`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-only-export) | — | 🟣 |
| [`require-jsdoc`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-jsdoc) | — | 🟣 |
| [`require-syntax`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-syntax) | — | 🟣 |
| [`restrict-identifier-characters`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/restrict-identifier-characters) | — | 🟣 |
| [`sort-array`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-array) | 🔧 | 🟣 |
| [`sort-call-signature`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-call-signature) | — | 🟣 |
| [`sort-class-members`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-class-members) | — | 🟣 |
| [`sort-construct-signature`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-construct-signature) | — | 🟣 |
| [`sort-export-specifiers`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-export-specifiers) | 🔧 | 🟣 |
| [`sort-keys`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-keys) | 🔧 | 🟣 |
| [`sort-top-comments`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-top-comments) | 🔧 | 🟣 |
| [`switch-case-spacing`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/switch-case-spacing) | — | 🟣 |
| [`template-literal-format`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/template-literal-format) | 🔧 | 🟣 |
| [`throw-error`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/throw-error) | — | 🟣 |
| [`throw-new-error`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/throw-new-error) | 🔧 | 🟣 |
| [`typescript/array-callback-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-array-callback-return-type) | — | 🟣 |
| [`typescript/class-methods-use-this`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-class-methods-use-this) | — | 🟣 |
| [`typescript/consistent-array-type-name`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-consistent-array-type-name) | — | 🟣 |
| [`typescript/define-function-in-one-statement`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-define-function-in-one-statement) | — | 🟣 |
| [`typescript/exhaustive-switch`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-exhaustive-switch) | — | 🟣 |
| [`typescript/no-boolean-literal-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-boolean-literal-type) | — | 🟣 |
| [`typescript/no-complex-declarator-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-complex-declarator-type) | — | 🟣 |
| [`typescript/no-complex-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-complex-return-type) | — | 🟣 |
| [`typescript/no-empty-interfaces`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-empty-interfaces) | — | 🟣 |
| [`typescript/no-inferrable-types`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-inferrable-types) | — | 🟣 |
| [`typescript/no-multi-type-tuples`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-multi-type-tuples) | — | 🟣 |
| [`typescript/no-never`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-never) | — | 🟣 |
| [`typescript/no-restricted-syntax`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-restricted-syntax) | — | 🟣 |
| [`typescript/no-unsafe-object-assign`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assign) | — | 🟣 |
| [`typescript/no-unsafe-object-assignment`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assignment) | — | 🟣 |
| [`typescript/prefer-array-type-alias`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-array-type-alias) | — | 🟣 |
| [`typescript/prefer-class-method`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-class-method) | — | 🟣 |
| [`typescript/prefer-enum`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-enum) | — | 🟣 |
| [`typescript/prefer-readonly-array`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-array) | — | 🟣 |
| [`typescript/prefer-readonly-map`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-map) | — | 🟣 |
| [`typescript/prefer-readonly-property`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-property) | — | 🟣 |
| [`typescript/prefer-readonly-set`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-set) | — | 🟣 |
| [`typescript/require-prop-type-annotation`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-prop-type-annotation) | — | 🟣 |
| [`typescript/require-this-void`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-this-void) | — | 🟣 |
| [`underscore-internal`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/underscore-internal) | — | 🟣 |
| [`unused-internal-properties`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/unused-internal-properties) | — | 🟣 |
| [`uppercase-iife`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/uppercase-iife) | — | 🟣 |
| [`words`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/words) | — | 🟣 |

## Documentation

- Rules docs: <https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/>
- Project docs site: <https://nick2bad4u.github.io/eslint-plugin-etc-misc/>

## License

[MIT](./LICENSE)
