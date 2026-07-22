import { objectEntries } from "ts-extras";

import { hasDeprecatedSamePluginReplacement } from "../_internal/rule-deprecation.js";
import { rules as pluginRules } from "../rules.js";

interface AllRuleLevelsOptions {
    readonly includeDeprecated: boolean;
    readonly strict: boolean;
}

type AllRuleSeverity = "error" | "warn";

const getRuleSeverity = (
    ruleModule: Readonly<(typeof pluginRules)[string]>,
    strict: boolean
): AllRuleSeverity => {
    if (ruleModule.meta.deprecated !== false) {
        return "warn";
    }

    return strict || ruleModule.meta.type === "problem" ? "error" : "warn";
};

/**
 * Build an exhaustive preset rule map with an explicit deprecation policy.
 */
export const createAllRuleLevels = ({
    includeDeprecated,
    strict,
}: Readonly<AllRuleLevelsOptions>): Readonly<
    Record<string, AllRuleSeverity>
> => {
    let ruleLevelsAccumulator: Record<string, AllRuleSeverity> = {};

    for (const [ruleName, ruleModule] of objectEntries(pluginRules)) {
        const isDeprecated = ruleModule.meta.deprecated !== false;

        if (
            isDeprecated &&
            (!includeDeprecated ||
                hasDeprecatedSamePluginReplacement({
                    deprecated: ruleModule.meta.deprecated,
                    ruleId: ruleName,
                }))
        ) {
            continue;
        }

        ruleLevelsAccumulator = {
            ...ruleLevelsAccumulator,
            [`etc-misc/${ruleName}`]: getRuleSeverity(ruleModule, strict),
        };
    }

    return Object.freeze(ruleLevelsAccumulator);
};
