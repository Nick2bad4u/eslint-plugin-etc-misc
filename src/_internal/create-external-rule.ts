import type { TSESLint } from "@typescript-eslint/utils";

type RuleContext = TSESLint.RuleContext<string, readonly unknown[]>;
type RuleModule = TSESLint.RuleModule<string, readonly unknown[]>;

type UnknownRecord = Readonly<Record<string, unknown>>;

const isObjectRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const hasCreateFunction = (
    value: unknown
): value is Readonly<{ create: RuleModule["create"] }> =>
    isObjectRecord(value) && typeof value["create"] === "function";

const createLegacyContextCompat = (context: RuleContext): RuleContext => {
    const contextRecord = context as RuleContext & UnknownRecord;

    return new Proxy(contextRecord, {
        get: (target, property, receiver): unknown => {
            if (property === "getSourceCode") {
                return (): Readonly<TSESLint.SourceCode> => target.sourceCode;
            }

            if (property === "getFilename") {
                return (): string => target.filename;
            }

            if (property === "getPhysicalFilename") {
                return (): string => target.physicalFilename;
            }

            if (property === "getCwd") {
                return (): string => target.cwd;
            }

            return Reflect.get(target, property, receiver);
        },
    }) as unknown as RuleContext;
};

/**
 * Resolve a rule module from an external ESLint plugin's `rules` map.
 */
export const getExternalRuleFromPlugin = (
    plugin: unknown,
    ruleName: string,
    pluginName: string
): unknown => {
    if (!isObjectRecord(plugin) || !isObjectRecord(plugin["rules"])) {
        throw new TypeError(
            `Plugin "${pluginName}" does not expose a valid rules map.`
        );
    }

    const rules = plugin["rules"];
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
    const externalMeta = isObjectRecord(externalRuleRecord["meta"])
        ? externalRuleRecord["meta"]
        : {};
    const externalDocs = isObjectRecord(externalMeta["docs"])
        ? externalMeta["docs"]
        : {};
    const create: RuleModule["create"] = (context) =>
        externalRule.create(createLegacyContextCompat(context));

    return {
        ...(externalRuleRecord as unknown as RuleModule),
        create,
        defaultOptions: Array.isArray(externalRuleRecord["defaultOptions"])
            ? (externalRuleRecord["defaultOptions"] as readonly unknown[])
            : [],
        meta: {
            ...(externalMeta as unknown as RuleModule["meta"]),
            docs: {
                ...(externalDocs as unknown as NonNullable<
                    RuleModule["meta"]
                >["docs"]),
                url: docsUrl,
            },
        } as RuleModule["meta"],
    };
};
