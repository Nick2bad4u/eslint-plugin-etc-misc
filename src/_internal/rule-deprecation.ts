import type { TSESLint } from "@typescript-eslint/utils";
import type { ArrayElement, UnknownArray } from "type-fest";

import { isDefined } from "ts-extras";

type DeprecatedInfo = Exclude<
    TSESLint.RuleMetaData<string>["deprecated"],
    boolean | undefined
>;
type ReplacedByInfo = ArrayElement<NonNullable<DeprecatedInfo["replacedBy"]>>;

type RuleDeprecationOptions = Readonly<{
    readonly deprecatedSince?: string;
    readonly message: string;
    readonly replacedBy?: readonly ReplacedByInfo[];
    readonly ruleId: string;
}>;

type RuleModule = TSESLint.RuleModule<string, Readonly<UnknownArray>>;

const docsBaseUrl =
    "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules";

/**
 * Create a replacement descriptor for deprecation metadata.
 */
export const createReplacementRuleInfo = (
    replacement: Readonly<{
        readonly plugin?: Readonly<{
            readonly name: string;
            readonly url?: string;
        }>;
        readonly rule?: Readonly<{
            readonly name: string;
            readonly url?: string;
        }>;
    }>
): ReplacedByInfo => ({
    ...(isDefined(replacement.plugin) && { plugin: replacement.plugin }),
    ...(isDefined(replacement.rule) && { rule: replacement.rule }),
});

/**
 * Create standardized deprecation metadata for this plugin.
 */
export const createDeprecatedRuleInfo = ({
    deprecatedSince = "1.0.0",
    message,
    replacedBy = [],
    ruleId,
}: RuleDeprecationOptions): DeprecatedInfo => ({
    availableUntil: "2.0.0",
    deprecatedSince,
    message,
    ...(replacedBy.length > 0 && { replacedBy: [...replacedBy] }),
    url: `${docsBaseUrl}/${ruleId.replaceAll("/", "-")}`,
});

/**
 * Determine whether structured deprecation metadata describes a compatibility
 * alias whose replacement belongs to this plugin.
 */
export const isDeprecatedSamePluginAlias = ({
    deprecated,
    ruleId,
}: Readonly<{
    readonly deprecated: TSESLint.RuleMetaData<string>["deprecated"];
    readonly ruleId: string;
}>): boolean => {
    if (typeof deprecated !== "object") {
        return false;
    }

    return (
        deprecated.replacedBy?.some(
            (replacement) =>
                replacement.plugin === undefined &&
                isDefined(replacement.rule?.name) &&
                replacement.rule.name !== ruleId
        ) ?? false
    );
};

/**
 * Apply deprecated+frozen lifecycle metadata to a rule module.
 */
export const withDeprecatedRuleLifecycle = <TRule extends RuleModule>(
    rule: TRule,
    options: RuleDeprecationOptions
): TRule => ({
    ...rule,
    meta: {
        ...rule.meta,
        deprecated: createDeprecatedRuleInfo(options),
        ...(rule.meta.docs !== undefined && {
            docs: {
                ...rule.meta.docs,
                deprecated: true,
                frozen: true,
            },
        }),
    },
});
