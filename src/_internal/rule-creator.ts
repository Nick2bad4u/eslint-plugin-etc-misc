import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray } from "type-fest";

import { ESLintUtils } from "@typescript-eslint/utils";

/**
 * Broad rule-module type used by incrementally migrated rule files.
 */
export type AnyRuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

/**
 * Additional docs metadata used by this plugin's rule catalog and presets.
 */
export interface RuleDocsMetadata extends TSESLint.RuleMetaDataDocs {
    readonly catalogId?: string;
    readonly catalogIndex?: number;
    readonly deprecated?: boolean;
    readonly frozen?: boolean;
    readonly recommended?: boolean;
    readonly requiresTypeChecking?: boolean;
    readonly ruleName?: string;
    readonly suggestion?: boolean;
}

type RuleCreatorFactory = ReturnType<
    typeof ESLintUtils.RuleCreator<RuleDocsMetadata>
>;

/**
 * Shared rule factory for plugin rules.
 */
const createRuleCreator = ESLintUtils.RuleCreator;

/**
 * Typed factory for defining plugin rules with consistent docs URLs.
 */
export const ruleCreator: RuleCreatorFactory =
    createRuleCreator<RuleDocsMetadata>((name) => {
        const docsPathName = name.replaceAll("/", "-");

        return `https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/${docsPathName}`;
    });
