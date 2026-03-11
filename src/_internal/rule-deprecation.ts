import type { TSESLint } from "@typescript-eslint/utils";

type DeprecatedInfo = Exclude<
    TSESLint.RuleMetaData<string>["deprecated"],
    boolean | undefined
>;
type ReplacedByInfo = NonNullable<DeprecatedInfo["replacedBy"]>[number];

type RuleDeprecationOptions = Readonly<{
    readonly message: string;
    readonly replacedBy?: readonly ReplacedByInfo[];
    readonly ruleId: string;
}>;

type RuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

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
    ...(replacement.plugin === undefined ? {} : { plugin: replacement.plugin }),
    ...(replacement.rule === undefined ? {} : { rule: replacement.rule }),
});

/**
 * Create standardized deprecation metadata for this plugin.
 */
export const createDeprecatedRuleInfo = ({
    message,
    replacedBy = [],
    ruleId,
}: RuleDeprecationOptions): DeprecatedInfo => ({
    availableUntil: "2.0.0",
    deprecatedSince: "1.0.0",
    message,
    ...(replacedBy.length === 0 ? {} : { replacedBy: [...replacedBy] }),
    url: `${docsBaseUrl}/${ruleId.replaceAll("/", "-")}`,
});

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
        ...(rule.meta.docs === undefined
            ? {}
            : {
                  docs: {
                      ...rule.meta.docs,
                      deprecated: true,
                      frozen: true,
                  },
              }),
    },
});
