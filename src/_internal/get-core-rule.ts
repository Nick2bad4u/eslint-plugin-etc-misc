import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

// eslint-disable-next-line import-x/no-deprecated, sonarjs/deprecation -- ESLint currently exposes core rules through this compatibility entrypoint.
import { builtinRules } from "eslint/use-at-your-own-risk";
import { isDefined } from "ts-extras";

type RuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

/**
 * Resolve a core ESLint rule module by rule ID.
 */
export const getCoreRule = (ruleId: string): RuleModule => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated, import-x/no-deprecated, sonarjs/deprecation -- ESLint currently exposes core rule modules through this entrypoint.
    const coreRule = builtinRules.get(ruleId);
    if (!isDefined(coreRule)) {
        throw new Error(`Missing core ESLint rule "${ruleId}".`);
    }

    return coreRule as unknown as RuleModule;
};
