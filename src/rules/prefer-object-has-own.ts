import { builtinRules } from "eslint/use-at-your-own-risk";

import { adaptExternalRule } from "../_internal/create-external-rule";

const externalRule = builtinRules.get("prefer-object-has-own");

if (externalRule === undefined) {
    throw new Error('Missing core ESLint rule "prefer-object-has-own".');
}

const rule = adaptExternalRule(
    externalRule,
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/prefer-object-has-own.md"
);

export default rule;
