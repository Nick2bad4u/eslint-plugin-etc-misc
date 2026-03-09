import { adaptExternalRule } from "../_internal/create-external-rule.js";
import { getCoreRule } from "../_internal/get-core-rule.js";

const externalRule = getCoreRule("accessor-pairs");

/**
 * Proxy of ESLint core `accessor-pairs` with plugin-local docs URL.
 */
const rule: ReturnType<typeof adaptExternalRule> = adaptExternalRule(
    externalRule,
    "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-writeonly.md"
);

export default rule;
