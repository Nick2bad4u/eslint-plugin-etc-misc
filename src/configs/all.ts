import { createAllRuleLevels } from "./all-rule-levels.js";

interface AllConfig {
    readonly name: "etc-misc/all";
    readonly rules: Readonly<Record<string, RuleSeverity>>;
}

type RuleSeverity = "error" | "warn";

const allRules: Readonly<Record<string, RuleSeverity>> = createAllRuleLevels({
    includeDeprecated: false,
    strict: false,
});

/**
 * Flat config preset enabling every non-deprecated plugin rule with
 * metadata-derived severities.
 */
export const all: AllConfig = {
    name: "etc-misc/all",
    rules: allRules,
};
