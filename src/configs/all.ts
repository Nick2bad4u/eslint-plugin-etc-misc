/* eslint-disable canonical/no-reassign-imports -- Rule entry map intentionally references imported plugin rules object. */

import { rules as pluginRules } from "../rules.js";

type AllConfig = {
    readonly rules: Readonly<Record<string, "error">>;
};

const allRuleEntries = Object.keys(pluginRules).map(
    (ruleName) => [`etc-misc/${ruleName}`, "error"] as const
);

const allRules = Object.fromEntries(allRuleEntries) as Record<string, "error">;

/**
 * Flat config preset enabling every available plugin rule.
 */
export const all: AllConfig = {
    rules: allRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */
