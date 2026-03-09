import { builtinRules } from "eslint/use-at-your-own-risk";

import { adaptExternalRule } from "../_internal/create-external-rule";

const externalRule = builtinRules.get("accessor-pairs");

if (externalRule === undefined) {
    throw new Error('Missing core ESLint rule "accessor-pairs".');
}

const rule = adaptExternalRule(
    externalRule,
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-writeonly.md"
);

export default rule;
