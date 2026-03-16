import { objectFromEntries, objectKeys, safeCastTo   } from "ts-extras";

import { recommended } from "./recommended.js";

type StrictConfig = {
    readonly rules: StrictRules;
};

type StrictRules = Readonly<{
    readonly [TRuleName in keyof typeof recommended.rules]: "error";
}>;

const recommendedRuleNames = safeCastTo<readonly (keyof typeof recommended.rules)[]>(objectKeys(
    recommended.rules
));

const strictRules = objectFromEntries(
    recommendedRuleNames.map((ruleName) => [ruleName, "error"] as const)
) as StrictRules;

/**
 * Strict preset that promotes every recommended rule to `error`.
 */
export const strict: StrictConfig = {
    rules: strictRules,
};
