# no-unused-disable

Disallow `eslint-disable` comments that do not suppress any diagnostics.

## Targeted pattern scope

This rule targets `eslint-disable` and related inline directive comments.

## What this rule reports

This rule reports disable directives that are not actually used to suppress any
rule violations.

## Why this rule exists

Unused disables hide lint signal, create maintenance noise, and can mask future
issues if copied forward.

## ❌ Incorrect

```ts
/* eslint-disable no-alert */
const value = 1;
```

## ✅ Correct

```ts
/* eslint-disable no-alert */
alert("x");
```

## Behavior and migration notes

This rule forwards options and behavior to
`@eslint-community/eslint-comments/no-unused-disable`.

- **Lifecycle:** Deprecated and frozen.
- **Deprecated since:** `v1.0.0`
- **Available until:** `v2.0.0`
- **Use instead:** [`@eslint-community/eslint-comments/no-unused-disable`](https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/no-unused-disable.html)

## ESLint flat config example

```ts
import etcMisc from "eslint-plugin-etc-misc";

export default [
	{
		plugins: { "etc-misc": etcMisc },
		rules: {
			"etc-misc/no-unused-disable": "error",
		},
	},
];
```

## When not to use it

Disable this rule only during temporary migration windows where broad
placeholder disables are explicitly managed.

## Package documentation

- [eslint-plugin-etc-misc README](https://github.com/Nick2bad4u/eslint-plugin-etc-misc#readme)

## Further reading

- [eslint-comments: `no-unused-disable`](https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/no-unused-disable.html)
