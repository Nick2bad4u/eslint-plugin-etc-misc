import { builtinRules } from "eslint/use-at-your-own-risk";
import { isDefined } from "ts-extras";

/**
 * Resolve a core ESLint rule module by rule ID.
 *
 * @throws When ESLint does not expose the requested rule.
 */
export const getCoreRule = (ruleId: string): unknown => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- ESLint currently exposes core rule modules through this entrypoint.
    const coreRule = builtinRules.get(ruleId);
    if (!isDefined(coreRule)) {
        throw new Error(`Missing core ESLint rule "${ruleId}".`);
    }

    return coreRule;
};
