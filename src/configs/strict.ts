import { recommended } from "./recommended.js";

type StrictConfig = {
    readonly rules: StrictRules;
};

type StrictRules = Readonly<{
    readonly [TRuleName in keyof typeof recommended.rules]: "error";
}>;

const recommendedRuleNames = Object.keys(
    recommended.rules
) as readonly (keyof typeof recommended.rules)[];

const strictRules = Object.fromEntries(
    recommendedRuleNames.map((ruleName) => [ruleName, "error"] as const)
) as StrictRules;

/**
 * Strict preset that promotes every recommended rule to `error`.
 */
export const strict: StrictConfig = {
    rules: strictRules,
};
