import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";

const rule = adaptExternalRule(
    getExternalRuleFromPlugin(
        eslintCommentsPlugin,
        "no-unused-disable",
        "@eslint-community/eslint-plugin-eslint-comments"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-unused-disable.md"
);

export default rule;
