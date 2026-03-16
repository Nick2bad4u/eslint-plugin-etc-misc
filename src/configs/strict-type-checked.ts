/* eslint-disable canonical/no-reassign-imports -- Flat-config strict type-checked preset intentionally inspects imported plugin rule metadata. */

import { objectEntries, objectFromEntries  } from "ts-extras";

import { rules as pluginRules } from "../rules.js";
import { strict } from "./strict.js";

type RuleDocsMetadata = Readonly<{
    readonly requiresTypeChecking?: boolean;
}>;

type StrictTypeCheckedConfig = {
    readonly languageOptions: Readonly<{
        readonly parserOptions: Readonly<{
            readonly projectService: true;
        }>;
    }>;
    readonly rules: Readonly<Record<string, "error">>;
};

const strictRuleEntries = objectEntries(strict.rules);

const additionalTypeCheckedRuleEntries = objectEntries(pluginRules)
    .flatMap(([ruleName, ruleModule]) => {
        if (ruleModule.meta.deprecated !== false) {
            return [];
        }

        const docsMetadata = ruleModule.meta.docs as
            | RuleDocsMetadata
            | undefined;

        if (docsMetadata?.requiresTypeChecking !== true) {
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

const strictTypeCheckedRules = objectFromEntries([
    ...strictRuleEntries,
    ...additionalTypeCheckedRuleEntries,
]) as Readonly<Record<string, "error">>;

/**
 * Strict preset augmented with every non-deprecated rule that requires type
 * information.
 */
export const strictTypeChecked: StrictTypeCheckedConfig = {
    languageOptions: {
        parserOptions: {
            projectService: true,
        },
    },
    rules: strictTypeCheckedRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */
