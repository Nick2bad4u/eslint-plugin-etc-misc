import { objectFromEntries, objectKeys, safeCastTo } from "ts-extras";

import { recommended } from "./recommended.js";

interface StrictConfig {
    readonly name: "etc-misc/strict";
    readonly rules: StrictRules;
}

type StrictRules = Readonly<{
    readonly [TRuleName in keyof typeof recommended.rules]: "error";
}>;

const recommendedRuleNames = safeCastTo<
    readonly (keyof typeof recommended.rules)[]
>(objectKeys(recommended.rules));

const strictRulesCandidate = objectFromEntries(
    recommendedRuleNames.map((ruleName) => [ruleName, "error" as const])
);

const hasStrictRuleCoverage = (
    candidateRules: Readonly<Partial<StrictRules>>
): candidateRules is StrictRules =>
    recommendedRuleNames.every(
        (ruleName) => candidateRules[ruleName] === "error"
    );

if (!hasStrictRuleCoverage(strictRulesCandidate)) {
    throw new Error(
        "Strict preset synthesis failed to include every recommended rule."
    );
}

const strictRules: StrictRules = strictRulesCandidate;

/**
 * Strict preset that promotes every recommended rule to `error`.
 */
export const strict: StrictConfig = {
    name: "etc-misc/strict",
    rules: strictRules,
};
