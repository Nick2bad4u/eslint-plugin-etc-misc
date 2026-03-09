import { builtinRules } from "eslint/use-at-your-own-risk";

import { adaptExternalRule } from "../_internal/create-external-rule";

const externalRule = builtinRules.get("default-case");

if (externalRule === undefined) {
    throw new Error('Missing core ESLint rule "default-case".');
}

const rule = adaptExternalRule(
    externalRule,
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/default-case.md"
);

export default rule;
