/* eslint-disable canonical/no-reassign-imports -- Flat-config strict type-checked preset intentionally inspects imported plugin rule metadata. */

import { rules as pluginRules } from "../rules.js";
import { strict } from "./strict.js";

type StrictTypeCheckedConfig = {
    readonly rules: Readonly<Record<string, "error">>;
};

const strictRuleEntries = Object.entries(strict.rules);

const additionalTypeCheckedRuleEntries = Object.entries(pluginRules)
    .flatMap(([ruleName, ruleModule]) => {
        if (ruleModule.meta.deprecated !== false) {
            return [];
        }

        if (ruleModule.meta.docs?.requiresTypeChecking !== true) {
            return [];
        }

        const qualifiedRuleName = `etc-misc/${ruleName}`;

        if (qualifiedRuleName in strict.rules) {
            return [];
        }

        return [[qualifiedRuleName, "error"] as const];
    })
    .toSorted(([leftRuleName], [rightRuleName]) =>
        leftRuleName.localeCompare(rightRuleName)
    );

const strictTypeCheckedRules = Object.fromEntries([
    ...strictRuleEntries,
    ...additionalTypeCheckedRuleEntries,
]) as Readonly<Record<string, "error">>;

/**
 * Strict preset augmented with every non-deprecated rule that requires type
 * information.
 */
export const strictTypeChecked: StrictTypeCheckedConfig = {
    rules: strictTypeCheckedRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */