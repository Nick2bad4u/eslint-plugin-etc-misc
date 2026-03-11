/* eslint-disable canonical/no-reassign-imports -- Rule entry map intentionally references imported plugin rules object. */

import { rules as pluginRules } from "../rules.js";

type AllConfig = {
    readonly rules: Readonly<Record<string, RuleSeverity>>;
};

type RuleSeverity = "error" | "warn";

const getAllPresetSeverity = (
    ruleModule: Readonly<(typeof pluginRules)[string]>
): RuleSeverity => {
    if (ruleModule.meta.deprecated !== false) {
        return "warn";
    }

    return ruleModule.meta.type === "problem" ? "error" : "warn";
};

const allRuleEntries = Object.entries(pluginRules).map(
    ([ruleName, ruleModule]) =>
        [`etc-misc/${ruleName}`, getAllPresetSeverity(ruleModule)] as const
);

const allRules = Object.fromEntries(allRuleEntries) as Readonly<
    Record<string, RuleSeverity>
>;

/**
 * Flat config preset enabling every available plugin rule.
 */
export const all: AllConfig = {
    rules: allRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */
