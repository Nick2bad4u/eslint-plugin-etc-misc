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

## Documentation

- Rules docs: <https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/>
- Project docs site: <https://nick2bad4u.github.io/eslint-plugin-etc-misc/>

## License

[MIT](./LICENSE)
