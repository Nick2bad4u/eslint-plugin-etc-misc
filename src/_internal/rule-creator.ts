/* eslint-disable total-functions/no-hidden-type-assertions -- @typescript-eslint RuleCreator requires an explicit docs metadata generic for typed docs fields. */

import type { TSESLint } from "@typescript-eslint/utils";

import { ESLintUtils } from "@typescript-eslint/utils";

/**
 * Broad rule-module type used by incrementally migrated rule files.
 */
export type AnyRuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

type RuleCreatorFactory = ReturnType<
    typeof ESLintUtils.RuleCreator<RuleDocsMetadata>
>;

type RuleDocsMetadata = {
    readonly catalogId?: string;
    readonly catalogIndex?: number;
    readonly deprecated?: boolean;
    readonly frozen?: boolean;
    readonly recommended: boolean;
    readonly requiresTypeChecking?: boolean;
    readonly ruleName?: string;
    readonly suggestion?: boolean;
};

/**
 * Shared rule factory for plugin rules.
 */
/**
 * Typed factory for defining plugin rules with consistent docs URLs.
 */
export const ruleCreator: RuleCreatorFactory =
    ESLintUtils.RuleCreator<RuleDocsMetadata>((name) => {
        const docsPathName = name.replaceAll("/", "-");

        return `https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/${docsPathName}`;
    });

/* eslint-enable total-functions/no-hidden-type-assertions -- Re-enable hidden assertion checks outside this required generic factory declaration. */
