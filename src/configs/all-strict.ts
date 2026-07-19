/* eslint-disable canonical/no-reassign-imports -- Rule entry map intentionally references imported plugin rules metadata. */

import { objectEntries } from "ts-extras";

import { isDeprecatedSamePluginAlias } from "../_internal/rule-deprecation.js";
import { rules as pluginRules } from "../rules.js";

interface AllStrictConfig {
    readonly name: "etc-misc/all-strict";
    readonly rules: Readonly<Record<string, RuleSeverity>>;
}

type RuleSeverity = "error" | "warn";

let allStrictRulesAccumulator: Record<string, RuleSeverity> = {};

for (const [ruleName, ruleModule] of objectEntries(pluginRules)) {
    if (
        isDeprecatedSamePluginAlias({
            deprecated: ruleModule.meta.deprecated,
            ruleId: ruleName,
        })
    ) {
        continue;
    }

    allStrictRulesAccumulator = {
        ...allStrictRulesAccumulator,
        [`etc-misc/${ruleName}`]:
            ruleModule.meta.deprecated === false ? "error" : "warn",
    };
}

const allStrictRules: Readonly<Record<string, RuleSeverity>> = Object.freeze(
    allStrictRulesAccumulator
);

/**
 * Flat config preset enabling every preset-eligible plugin rule at `error`,
 * except deprecated rules which remain at `warn`. Deprecated same-plugin
 * compatibility aliases remain available for manual configuration.
 */
export const allStrict: AllStrictConfig = {
    name: "etc-misc/all-strict",
    rules: allStrictRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */
