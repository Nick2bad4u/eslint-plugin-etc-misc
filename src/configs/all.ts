/* eslint-disable canonical/no-reassign-imports -- Rule entry map intentionally references imported plugin rules object. */
import { objectEntries } from "ts-extras";

import { isDeprecatedSamePluginAlias } from "../_internal/rule-deprecation.js";
import { rules as pluginRules } from "../rules.js";

interface AllConfig {
    readonly name: "etc-misc/all";
    readonly rules: Readonly<Record<string, RuleSeverity>>;
}

type RuleSeverity = "error" | "warn";

const getAllPresetSeverity = (
    ruleModule: Readonly<(typeof pluginRules)[string]>
): RuleSeverity => {
    if (ruleModule.meta.deprecated !== false) {
        return "warn";
    }

    return ruleModule.meta.type === "problem" ? "error" : "warn";
};

let allRulesAccumulator: Record<string, RuleSeverity> = {};

for (const [ruleName, ruleModule] of objectEntries(pluginRules)) {
    if (
        isDeprecatedSamePluginAlias({
            deprecated: ruleModule.meta.deprecated,
            ruleId: ruleName,
        })
    ) {
        continue;
    }

    allRulesAccumulator = {
        ...allRulesAccumulator,
        [`etc-misc/${ruleName}`]: getAllPresetSeverity(ruleModule),
    };
}

const allRules: Readonly<Record<string, RuleSeverity>> =
    Object.freeze(allRulesAccumulator);

/**
 * Flat config preset enabling every preset-eligible plugin rule. Deprecated
 * same-plugin compatibility aliases remain available for manual configuration.
 */
export const all: AllConfig = {
    name: "etc-misc/all",
    rules: allRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */
