import unicornPlugin from "eslint-plugin-unicorn";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule";

/**
 * Proxy of external `unicorn/no-unused-properties`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        unicornPlugin,
        "no-unused-properties",
        "eslint-plugin-unicorn"
    ),
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/unused-internal-properties.md"
);

export default rule;
