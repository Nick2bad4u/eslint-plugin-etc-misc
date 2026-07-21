import type { TSESLint } from "@typescript-eslint/utils";
import type { UnknownArray, UnknownRecord } from "type-fest";

import { keyIn, objectEntries, safeCastTo } from "ts-extras";

import type { RuleDocsMetadata } from "./rule-creator.js";

type RuleContext = TSESLint.RuleContext<string, Readonly<UnknownArray>>;
type RuleModule = Readonly<{
    readonly meta: Readonly<{ readonly languages: readonly ["js/js"] }> &
        TSESLint.RuleMetaData<string, RuleDocsMetadata, Readonly<UnknownArray>>;
}> &
    TSESLint.RuleModule<string, Readonly<UnknownArray>, RuleDocsMetadata>;

const isObjectRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const hasCreateFunction = (
    value: unknown
): value is Readonly<UnknownRecord> &
    Readonly<{ readonly create: RuleModule["create"] }> =>
    isObjectRecord(value) && typeof value["create"] === "function";

const isRuleMetaDocs = (value: unknown): value is TSESLint.RuleMetaDataDocs =>
    isObjectRecord(value) && typeof value["description"] === "string";

const getNormalizedMetaType = (value: unknown): RuleModule["meta"]["type"] => {
    if (value === "layout" || value === "problem" || value === "suggestion") {
        return value;
    }

    return "problem";
};

const getNormalizedMetaMessages = (value: unknown): Record<string, string> => {
    if (!isObjectRecord(value)) {
        return {};
    }

    let normalizedMessages: Record<string, string> = {};

    for (const [key, message] of objectEntries(value)) {
        if (typeof message !== "string") {
            continue;
        }

        normalizedMessages = {
            ...normalizedMessages,
            [key]: message,
        };
    }

    return normalizedMessages;
};

type RuleSchema = RuleModule["meta"]["schema"];
type RuleSchemaObject = Exclude<RuleSchema, Readonly<UnknownArray>>;

const isJsonSchemaLike = (value: unknown): value is RuleSchemaObject => {
    if (!isObjectRecord(value)) {
        return false;
    }

    return (
        keyIn(value, "allOf") ||
        keyIn(value, "anyOf") ||
        keyIn(value, "oneOf") ||
        keyIn(value, "properties") ||
        keyIn(value, "type")
    );
};

const isJsonSchemaArray = (
    value: unknown
): value is readonly RuleSchemaObject[] =>
    Array.isArray(value) && value.every((entry) => isJsonSchemaLike(entry));

const getNormalizedMetaSchema = (
    value: unknown
): RuleModule["meta"]["schema"] => {
    if (isJsonSchemaArray(value)) {
        return value;
    }

    if (isJsonSchemaLike(value)) {
        return value;
    }

    return [];
};

const createLegacyContextCompat = (context: RuleContext): RuleContext =>
    new Proxy(context, {
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
    });

/**
 * Adapt an ESLint rule so it points docs to this repository.
 */
export const adaptExternalRule = (
    externalRule: unknown,
    docsUrl: string
): RuleModule => {
    if (!hasCreateFunction(externalRule)) {
        throw new TypeError("External rule module does not expose create().");
    }

    const externalRuleRecord = externalRule;
    const externalMetaRecord = isObjectRecord(externalRuleRecord["meta"])
        ? externalRuleRecord["meta"]
        : {};
    const externalDocs = isRuleMetaDocs(externalMetaRecord["docs"])
        ? externalMetaRecord["docs"]
        : {
              description:
                  "External rule re-exported by eslint-plugin-etc-misc.",
          };
    const create: RuleModule["create"] = (context) =>
        externalRule.create(createLegacyContextCompat(context));
    const externalRuleModule =
        safeCastTo<Partial<RuleModule>>(externalRuleRecord);

    return {
        ...externalRuleModule,
        create,
        defaultOptions: Array.isArray(externalRuleRecord["defaultOptions"])
            ? safeCastTo<Readonly<UnknownArray>>(
                  externalRuleRecord["defaultOptions"]
              )
            : [],
        meta: {
            ...externalMetaRecord,
            docs: {
                ...externalDocs,
                url: docsUrl,
            },
            languages: ["js/js"],
            messages: getNormalizedMetaMessages(externalMetaRecord["messages"]),
            schema: getNormalizedMetaSchema(externalMetaRecord["schema"]),
            type: getNormalizedMetaType(externalMetaRecord["type"]),
        },
    };
};
