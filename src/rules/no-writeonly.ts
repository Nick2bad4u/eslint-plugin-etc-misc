import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";

const externalRule = getCoreRule("accessor-pairs");

/**
 * Proxy of ESLint core `accessor-pairs` with plugin-local docs URL.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-writeonly"
);

export default rule;
