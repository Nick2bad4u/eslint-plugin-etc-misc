import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";

const rule = adaptExternalRule(
    getExternalRuleFromPlugin(
        tsEslintPlugin,
        "no-unnecessary-type-parameters",
        "@typescript-eslint/eslint-plugin"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-useless-generics.md"
);

export default rule;
