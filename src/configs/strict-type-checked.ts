/* eslint-disable canonical/no-reassign-imports -- Flat-config strict type-checked preset intentionally inspects imported plugin rule metadata. */

import {
    objectEntries,
    objectFromEntries,
    objectHasOwn,
    safeCastTo,
} from "ts-extras";

import type { RuleDocsMetadata } from "../_internal/rule-creator.js";

import { rules as pluginRules } from "../rules.js";
import { strict } from "./strict.js";

interface StrictTypeCheckedConfig {
    readonly languageOptions: Readonly<{
        readonly parserOptions: Readonly<{
            readonly projectService: true;
        }>;
    }>;
    readonly name: "etc-misc/strict-type-checked";
    readonly rules: Readonly<Record<string, "error">>;
}

const additionalTypeCheckedRuleEntries: readonly (readonly [
    string,
    "error",
])[] = objectEntries(pluginRules).flatMap(([ruleName, ruleModule]) => {
    if (ruleModule.meta.deprecated !== false) {
        return [];
    }

    const docsMetadata = safeCastTo<RuleDocsMetadata | undefined>(
        ruleModule.meta.docs
    );

    if (docsMetadata?.requiresTypeChecking !== true) {
        return [];
    }

    const qualifiedRuleName = `etc-misc/${ruleName}`;

    if (objectHasOwn(strict.rules, qualifiedRuleName)) {
        return [];
    }

    const severity = "error" as const;

    return [[qualifiedRuleName, severity] as const];
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
