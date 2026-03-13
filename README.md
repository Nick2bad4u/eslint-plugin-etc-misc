# eslint-plugin-etc-misc

[![npm version.](https://img.shields.io/npm/v/eslint-plugin-etc-misc)](https://www.npmjs.com/package/eslint-plugin-etc-misc) [![npm downloads.](https://img.shields.io/npm/dm/eslint-plugin-etc-misc)](https://www.npmjs.com/package/eslint-plugin-etc-misc) [![license.](https://img.shields.io/npm/l/eslint-plugin-etc-misc)](./LICENSE)

Opinionated ESLint plugin that combines and curates rules from `etc` and `misc`
style linting patterns for TypeScript-heavy codebases.

## Credits

This plugin builds on ideas and rule work from:

- [`eslint-plugin-etc`](https://github.com/cartant/eslint-plugin-etc) by [Nicholas Jamieson](https://github.com/cartant)
- [`eslint-plugin-misc`](https://github.com/iliubinskii/eslint-plugin-misc) by [Ilia Liubinskii](https://github.com/iliubinskii)

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

If your project uses CommonJS config files, `require()` works too:

```js
// eslint.config.cjs
const etcMisc = require("eslint-plugin-etc-misc");

module.exports = [etcMisc.configs.recommended];
```

## Presets

| Preset |
| --- |
| [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [`etcMisc.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) |
| [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) [`etcMisc.configs.all`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) |

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
- `Preset key` legend:
  - [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) — [`etcMisc.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended)
  - [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) — [`etcMisc.configs.all`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all)
- `Deprecated` legend: `⚠️` = deprecated

| Rule | Fix | Preset key | Deprecated | Recommended replacement |
| --- | :-: | :-- | :-: | :-- |
| [`array-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/array-type) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/array-type`](https://typescript-eslint.io/rules/array-type) |
| [`class-match-filename`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/class-match-filename) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`comment-spacing`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/comment-spacing) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`consistent-empty-lines`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-empty-lines) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`consistent-enum-members`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-enum-members) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`consistent-filename`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-filename) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`unicorn/filename-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md) |
| [`consistent-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`consistent-optional-props`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-optional-props) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`consistent-source-extension`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-source-extension) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`import/extensions`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md) |
| [`consistent-symbol-description`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-symbol-description) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`default-case`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/default-case) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`disallow-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/disallow-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`export-matching-filename-only`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/export-matching-filename-only) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`match-filename`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/match-filename) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`max-identifier-blocks`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/max-identifier-blocks) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-assign-mutated-array`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-assign-mutated-array) | — | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-at-sign-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-at-sign-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-at-sign-internal-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-at-sign-internal-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-chain-coalescence-mixture`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-chain-coalescence-mixture) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-commented-out-code`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-commented-out-code) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`no-commented-code`](https://www.npmjs.com/package/eslint-plugin-no-commented-code) |
| [`no-const-enum`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-const-enum) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-deprecated`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-deprecated) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-deprecated`](https://typescript-eslint.io/rules/no-deprecated) |
| [`no-enum`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-enum) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-expression-empty-lines`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-expression-empty-lines) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-foreach`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-foreach) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-implicit-any-catch`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-implicit-any-catch) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-index-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-index-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-internal`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-internal) | — | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-internal-modules`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-internal-modules) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-language-mixing`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-language-mixing) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-misused-generics`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-misused-generics) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-mixed-enums`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-mixed-enums) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-mixed-enums`](https://typescript-eslint.io/rules/no-mixed-enums) |
| [`no-negated-conditions`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-negated-conditions) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-nodejs-modules`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-nodejs-modules) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-param-reassign`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-param-reassign) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-relative-parent-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-relative-parent-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`import/no-relative-parent-imports`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-parent-imports.md) |
| [`no-restricted-syntax`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-restricted-syntax) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax) |
| [`no-secret`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-secret) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`secretlint`](https://github.com/secretlint/secretlint) · [`detect-secrets`](https://github.com/Yelp/detect-secrets) · [`no-secrets/no-secrets`](https://github.com/nickdeis/eslint-plugin-no-secrets) |
| [`no-self-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-self-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`import/no-self-import`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md) |
| [`no-shadow`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-shadow) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-shadow`](https://typescript-eslint.io/rules/no-shadow) |
| [`no-sibling-import`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-sibling-import) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-single-line-comment`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-single-line-comment) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-t`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-t) | — | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-underscore-export`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-underscore-export) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-unnecessary-as-const`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-as-const) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-unnecessary-break`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-break) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-unnecessary-initialization`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-initialization) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-unnecessary-template-literal`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-template-literal) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`no-unused-disable`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unused-disable) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@eslint-community/eslint-comments/no-unused-disable`](https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/no-unused-disable.html) |
| [`no-useless-generics`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-useless-generics) | 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-unnecessary-type-parameters`](https://typescript-eslint.io/rules/no-unnecessary-type-parameters) |
| [`no-value-tostring`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-value-tostring) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-base-to-string`](https://typescript-eslint.io/rules/no-base-to-string) |
| [`no-writeonly`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-writeonly) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`object-format`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/object-format) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`only-export-name`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/only-export-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`prefer-arrow-function-property`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-arrow-function-property) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`prefer-const-require`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-const-require) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`prefer-includes`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-includes) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`unicorn/prefer-includes`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-includes.md) |
| [`prefer-interface`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-interface) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/consistent-type-definitions`](https://typescript-eslint.io/rules/consistent-type-definitions) |
| [`prefer-less-than`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-less-than) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`prefer-object-has-own`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-object-has-own) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`eslint/prefer-object-has-own`](https://eslint.org/docs/latest/rules/prefer-object-has-own) |
| [`prefer-only-export`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-only-export) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`require-jsdoc`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-jsdoc) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`jsdoc/require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md) |
| [`require-syntax`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/require-syntax) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`restrict-identifier-characters`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/restrict-identifier-characters) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`sort-array`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-array) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`sort-call-signature`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-call-signature) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`sort-class-members`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-class-members) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`sort-class-members`](https://www.npmjs.com/package/eslint-plugin-sort-class-members) · [`perfectionist`](https://perfectionist.dev/) |
| [`sort-construct-signature`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-construct-signature) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`sort-export-specifiers`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-export-specifiers) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`sort-keys`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-keys) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`sort-top-comments`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-top-comments) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`switch-case-spacing`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/switch-case-spacing) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@stylistic/switch-colon-spacing`](https://eslint.style/rules/switch-colon-spacing) |
| [`template-literal-format`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/template-literal-format) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`throw-error`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/throw-error) | 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`throw-new-error`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/throw-new-error) | 🔧 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`unicorn/throw-new-error`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/throw-new-error.md) |
| [`typescript/array-callback-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-array-callback-return-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/class-methods-use-this`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-class-methods-use-this) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/class-methods-use-this`](https://typescript-eslint.io/rules/class-methods-use-this) |
| [`typescript/consistent-array-type-name`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-consistent-array-type-name) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/define-function-in-one-statement`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-define-function-in-one-statement) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/exhaustive-switch`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-exhaustive-switch) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/switch-exhaustiveness-check`](https://typescript-eslint.io/rules/switch-exhaustiveness-check) |
| [`typescript/no-boolean-literal-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-boolean-literal-type) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-complex-declarator-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-complex-declarator-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-complex-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-complex-return-type) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-empty-interfaces`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-empty-interfaces) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-empty-object-type`](https://typescript-eslint.io/rules/no-empty-object-type) |
| [`typescript/no-inferrable-types`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-inferrable-types) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-inferrable-types`](https://typescript-eslint.io/rules/no-inferrable-types) |
| [`typescript/no-multi-type-tuples`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-multi-type-tuples) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-never`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-never) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-const`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-const) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-default-parameter`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-default-parameter) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-let`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-let) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-optional`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-optional) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-promise-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-promise-return-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-readonly-property`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-readonly-property) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-return-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-redundant-undefined-var`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-var) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-restricted-syntax`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-restricted-syntax) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`@typescript-eslint/no-restricted-syntax`](https://typescript-eslint.io/rules/no-restricted-syntax) |
| [`typescript/no-unsafe-object-assign`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assign) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/no-unsafe-object-assignment`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-unsafe-object-assignment) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-array-type-alias`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-array-type-alias) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-class-method`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-class-method) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-enum`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-enum) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-named-tuple-members`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-named-tuple-members) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-array`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-array) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-array-parameter`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-array-parameter) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-index-signature`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-index-signature) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-map`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-map) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-property`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-property) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-record`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-record) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/prefer-readonly-set`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-set) | 🔧 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-prop-type-annotation`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-prop-type-annotation) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-array-property-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-array-property-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-array-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-array-return-type) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-array-type-alias`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-array-type-alias) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-map-parameter-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-parameter-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-map-property-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-property-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-map-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-return-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-map-type-alias`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-type-alias) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-record-parameter-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-parameter-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-record-property-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-property-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-record-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-return-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-record-type-alias`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-type-alias) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-set-parameter-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-parameter-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-set-property-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-property-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-set-return-type`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-return-type) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-readonly-set-type-alias`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-type-alias) | 🔧 💡 | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`typescript/require-this-void`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-this-void) | 🔧 💡 | [🟡](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`underscore-internal`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/underscore-internal) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | — | — |
| [`unused-internal-properties`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/unused-internal-properties) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`unicorn/no-unused-properties`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unused-properties.md) |
| [`uppercase-iife`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/uppercase-iife) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`unicorn/no-unreadable-iife`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-iife.md) |
| [`words`](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/words) | — | [🟣](https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/presets/all) | ⚠️ | [`write-good-comments`](https://github.com/kantord/eslint-plugin-write-good-comments) |

## Documentation

- Rules docs: <https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/>
- Project docs site: <https://nick2bad4u.github.io/eslint-plugin-etc-misc/>

## Contributors
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors.](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/danielnixon"><img src="https://avatars.githubusercontent.com/u/6418489?v=4?s=80" width="80px;" alt="Daniel Nixon"/><br /><sub><b>Daniel Nixon</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=danielnixon" title="Code">💻</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/felixfbecker"><img src="https://avatars.githubusercontent.com/u/10532611?v=4?s=80" width="80px;" alt="Felix Becker"/><br /><sub><b>Felix Becker</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=felixfbecker" title="Code">💻</a></td>
      <td align="center" valign="top" width="25%"><a href="https://upleveled.io/"><img src="https://avatars.githubusercontent.com/u/1935696?v=4?s=80" width="80px;" alt="Karl Horky"/><br /><sub><b>Karl Horky</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=karlhorky" title="Code">💻</a></td>
      <td align="center" valign="top" width="25%"><a href="https://medium.com/@martin_hotell"><img src="https://avatars.githubusercontent.com/u/1223799?v=4?s=80" width="80px;" alt="Martin Hochel"/><br /><sub><b>Martin Hochel</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=Hotell" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://ncjamieson.com/"><img src="https://avatars.githubusercontent.com/u/3878593?v=4?s=80" width="80px;" alt="Nicholas Jamieson"/><br /><sub><b>Nicholas Jamieson</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=cartant" title="Code">💻</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/Nick2bad4u"><img src="https://avatars.githubusercontent.com/u/20943337?v=4?s=80" width="80px;" alt="Nick2bad4u"/><br /><sub><b>Nick2bad4u</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/issues?q=author%3ANick2bad4u" title="Bug reports">🐛</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=Nick2bad4u" title="Code">💻</a> <a href="#content-Nick2bad4u" title="Content">🖋</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=Nick2bad4u" title="Documentation">📖</a> <a href="#ideas-Nick2bad4u" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Nick2bad4u" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Nick2bad4u" title="Maintenance">🚧</a> <a href="#plugin-Nick2bad4u" title="Plugin/utility libraries">🔌</a> <a href="#research-Nick2bad4u" title="Research">🔬</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/pulls?q=is%3Apr+reviewed-by%3ANick2bad4u" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/commits?author=Nick2bad4u" title="Tests">⚠️</a> <a href="#tool-Nick2bad4u" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://snyk.io/"><img src="https://avatars.githubusercontent.com/u/19733683?v=4?s=80" width="80px;" alt="Snyk bot"/><br /><sub><b>Snyk bot</b></sub></a><br /><a href="#security-snyk-bot" title="Security">🛡️</a> <a href="#infra-snyk-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-snyk-bot" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-etc-misc/pulls?q=is%3Apr+reviewed-by%3Asnyk-bot" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="25%"><a href="https://www.stepsecurity.io/"><img src="https://avatars.githubusercontent.com/u/89328645?v=4?s=80" width="80px;" alt="StepSecurity Bot"/><br /><sub><b>StepSecurity Bot</b></sub></a><br /><a href="#security-step-security-bot" title="Security">🛡️</a> <a href="#infra-step-security-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-step-security-bot" title="Maintenance">🚧</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=80" width="80px;" alt="dependabot[bot]"/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="#infra-dependabot[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-dependabot[bot]" title="Security">🛡️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

[MIT](./LICENSE)
