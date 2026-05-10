/* eslint-disable canonical/no-reassign-imports -- Flat-config strict type-checked preset intentionally inspects imported plugin rule metadata. */

import { keyIn, objectEntries, objectFromEntries } from "ts-extras";

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
    readonly name: "etc-misc/strict-type-checked";
    readonly rules: Readonly<Record<string, "error">>;
};

const additionalTypeCheckedRuleEntries: readonly (readonly [
    string,
    "error",
])[] = objectEntries(pluginRules).flatMap(([ruleName, ruleModule]) => {
    if (ruleModule.meta.deprecated !== false) {
        return [];
    }

    const docsMetadata = ruleModule.meta.docs as RuleDocsMetadata | undefined;

    if (docsMetadata?.requiresTypeChecking !== true) {
        return [];
    }

    const qualifiedRuleName = `etc-misc/${ruleName}`;

    if (keyIn(strict.rules, qualifiedRuleName)) {
        return [];
    }

    return [[qualifiedRuleName, "error"] as const];
});

const strictTypeCheckedRules = {
    ...strict.rules,
    ...objectFromEntries(additionalTypeCheckedRuleEntries),
} satisfies Readonly<Record<string, "error">>;

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
    name: "etc-misc/strict-type-checked",
    rules: strictTypeCheckedRules,
};

/* eslint-enable canonical/no-reassign-imports -- Re-enable canonical import reassignment restrictions for the remainder of the file. */
