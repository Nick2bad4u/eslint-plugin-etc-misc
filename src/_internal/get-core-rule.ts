import type { TSESLint } from "@typescript-eslint/utils";

// eslint-disable-next-line import-x/no-deprecated -- ESLint currently exposes core rules through this compatibility entrypoint.
import { builtinRules } from "eslint/use-at-your-own-risk";

type RuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

/**
 * Resolve a core ESLint rule module by rule ID.
 */
export const getCoreRule = (ruleId: string): RuleModule => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated, etc/no-deprecated, import-x/no-deprecated -- ESLint currently exposes core rule modules through this entrypoint.
    const coreRule = builtinRules.get(ruleId);
    if (coreRule === undefined) {
        throw new Error(`Missing core ESLint rule "${ruleId}".`);
    }

    return coreRule as unknown as RuleModule;
};
