import type { TSESLint } from "@typescript-eslint/utils";

type RuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

type UnknownRecord = Readonly<Record<string, unknown>>;

const isObjectRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const hasCreateFunction = (
    value: unknown
): value is Readonly<{ create: RuleModule["create"] }> =>
    isObjectRecord(value) && typeof value.create === "function";

/**
 * Resolve a rule module from an external ESLint plugin's `rules` map.
 */
export const getExternalRuleFromPlugin = (
    plugin: unknown,
    ruleName: string,
    pluginName: string
): unknown => {
    if (!isObjectRecord(plugin) || !isObjectRecord(plugin.rules)) {
        throw new TypeError(
            `Plugin "${pluginName}" does not expose a valid rules map.`
        );
    }

    const { rules } = plugin;
    if (!Object.hasOwn(rules, ruleName)) {
        throw new Error(
            `Rule "${ruleName}" was not found in plugin "${pluginName}".`
        );
    }

    return rules[ruleName];
};

/**
 * Adapt an external rule so it points docs to this repository.
 */
export const adaptExternalRule = (
    externalRule: unknown,
    docsUrl: string
): RuleModule => {
    if (!hasCreateFunction(externalRule)) {
        throw new TypeError("External rule module does not expose create().");
    }

    const externalRuleRecord = externalRule as UnknownRecord;
    const externalMeta = isObjectRecord(externalRuleRecord.meta)
        ? externalRuleRecord.meta
        : {};
    const externalDocs = isObjectRecord(externalMeta.docs)
        ? externalMeta.docs
        : {};

    return {
        ...(externalRuleRecord as RuleModule),
        defaultOptions: Array.isArray(externalRuleRecord.defaultOptions)
            ? (externalRuleRecord.defaultOptions as readonly unknown[])
            : [],
        meta: {
            ...(externalMeta as RuleModule["meta"]),
            docs: {
                ...(externalDocs as NonNullable<RuleModule["meta"]>["docs"]),
                url: docsUrl,
            },
        } as RuleModule["meta"],
    };
};
