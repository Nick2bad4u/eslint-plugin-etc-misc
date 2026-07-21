import type { TSESLint } from "@typescript-eslint/utils";
import type { Except, UnknownArray } from "type-fest";

import { ESLintUtils } from "@typescript-eslint/utils";

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

type RuleCreatorFactory = <
    Options extends Readonly<UnknownArray>,
    MessageIds extends string,
>(
    definition: RuleDefinition<Options, MessageIds>
) => Readonly<{ readonly name: string }> &
    TSESLint.RuleModule<MessageIds, Options, RuleDocsMetadata>;

type RuleDefinition<
    Options extends Readonly<UnknownArray>,
    MessageIds extends string,
> = Readonly<{
    readonly create: (
        context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
        optionsWithDefault: Readonly<Options>
    ) => TSESLint.RuleListener;
    readonly defaultOptions?: Readonly<Options>;
    readonly meta: Except<
        TSESLint.RuleMetaData<MessageIds, RuleDocsMetadata, Options>,
        "docs"
    > &
        Readonly<{
            readonly docs: RuleDocsMetadata & TSESLint.RuleMetaDataDocs;
            readonly languages: RuleLanguages;
        }>;
    readonly name: string;
}>;

type RuleLanguages = readonly ["js/js"];

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
