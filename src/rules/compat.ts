import compatPlugin from "eslint-plugin-compat";

import {
    adaptExternalRule,
    getExternalRuleFromPlugin,
} from "../_internal/create-external-rule.js";

/** Adapt the maintained eslint-plugin-compat rule to this plugin. */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    getExternalRuleFromPlugin(compatPlugin, "compat", "eslint-plugin-compat"),
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/compat"
);

export default rule;
