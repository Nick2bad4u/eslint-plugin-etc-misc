import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";

const externalRule = getCoreRule("default-case");

/**
 * Proxy of ESLint core `default-case` with plugin-local docs URL.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/default-case.md"
);

export default rule;
