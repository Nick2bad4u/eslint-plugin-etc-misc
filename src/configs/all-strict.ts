import { createAllRuleLevels } from "./all-rule-levels.js";

interface AllStrictConfig {
    readonly name: "etc-misc/all-strict";
    readonly rules: Readonly<Record<string, RuleSeverity>>;
}

type RuleSeverity = "error" | "warn";

const allStrictRules: Readonly<Record<string, RuleSeverity>> =
    createAllRuleLevels({
        includeDeprecated: false,
        strict: true,
    });

/**
 * Flat config preset enabling every non-deprecated plugin rule at `error`.
 */
export const allStrict: AllStrictConfig = {
    name: "etc-misc/all-strict",
    rules: allStrictRules,
};
