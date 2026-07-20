import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";

/**
 * Adapter for `eslint-plugin-simple-import-sort/exports`.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(
        simpleImportSortPlugin,
        "exports",
        "eslint-plugin-simple-import-sort"
    ),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-exports"
);

export default rule;
