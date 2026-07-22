import { createAllRuleLevels } from "./all-rule-levels.js";

interface AllWithDeprecatedConfig {
    readonly name: "etc-misc/all-with-deprecated";
    readonly rules: Readonly<Record<string, RuleSeverity>>;
}

type RuleSeverity = "error" | "warn";

const allWithDeprecatedRules: Readonly<Record<string, RuleSeverity>> =
    createAllRuleLevels({
        includeDeprecated: true,
        strict: false,
    });

/**
 * Flat config preset enabling every preset-eligible plugin rule with
 * metadata-derived severities. Deprecated rules remain at `warn`, while
 * deprecated same-plugin replacements stay excluded to prevent duplicate
 * execution.
 */
export const allWithDeprecated: AllWithDeprecatedConfig = {
    name: "etc-misc/all-with-deprecated",
    rules: allWithDeprecatedRules,
};
