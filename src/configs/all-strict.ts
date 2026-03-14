/* eslint-disable canonical/no-reassign-imports -- Rule entry map intentionally references imported plugin rules metadata. */

import { rules as pluginRules } from "../rules.js";

type AllStrictConfig = {
    readonly rules: Readonly<Record<string, RuleSeverity>>;
};

type RuleSeverity = "error" | "warn";

const allStrictRuleEntries = Object.entries(pluginRules).map(
    ([ruleName, ruleModule]) =>
        [
            `etc-misc/${ruleName}`,
            ruleModule.meta.deprecated === false ? "error" : "warn",
        ] as const
);

const allStrictRules = Object.fromEntries(allStrictRuleEntries) as Readonly<
    Record<string, RuleSeverity>
>;

/**
 * Flat config preset enabling every plugin rule at `error`, except deprecated
 * rules which remain at `warn`.
 */
export const allStrict: AllStrictConfig = {
    rules: allStrictRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */