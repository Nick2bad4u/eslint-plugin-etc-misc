import unusedImportsPlugin from "eslint-plugin-unused-imports";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";

/**
 * Adapter for `eslint-plugin-unused-imports/no-unused-imports`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        unusedImportsPlugin,
        "no-unused-imports",
        "eslint-plugin-unused-imports"
    ),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unused-imports"
);

export default rule;
