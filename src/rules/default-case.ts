import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";

const externalRule = getCoreRule("default-case");

/**
 * Proxy of ESLint core `default-case` with plugin-local docs URL.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/default-case"
);

export default rule;
