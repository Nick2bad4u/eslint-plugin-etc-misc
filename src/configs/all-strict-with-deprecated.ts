import { createAllRuleLevels } from "./all-rule-levels.js";

interface AllStrictWithDeprecatedConfig {
    readonly name: "etc-misc/all-strict-with-deprecated";
    readonly rules: Readonly<Record<string, RuleSeverity>>;
}

type RuleSeverity = "error" | "warn";

const allStrictWithDeprecatedRules: Readonly<Record<string, RuleSeverity>> =
    createAllRuleLevels({
        includeDeprecated: true,
        strict: true,
    });

/**
 * Flat config preset enabling every non-deprecated plugin rule at `error` and
 * every deprecated rule without a same-plugin replacement at `warn`.
 */
export const allStrictWithDeprecated: AllStrictWithDeprecatedConfig = {
    name: "etc-misc/all-strict-with-deprecated",
    rules: allStrictWithDeprecatedRules,
};
