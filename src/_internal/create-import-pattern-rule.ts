import type { TSESTree as es } from "@typescript-eslint/utils";

import {
    getImportSourceFromNode,
    shouldReportImportSource,
} from "./import-patterns";
import { ruleCreator } from "./rule-creator";

/**
 * Rule factory options for import source pattern rules.
 */
interface CreateImportPatternRuleOptions {
    /**
     * Default disallow patterns applied when options do not override
     * `disallow`.
     */
    readonly defaultDisallowPatterns: readonly string[];
    /**
     * Human-friendly rule description.
     */
    readonly description: string;
    /**
     * Rule identifier used for metadata and exported rule map key.
     */
    readonly name: string;
}

type ImportPatternMessageIds = "disallowedSource";

/**
 * Rule options tuple for import pattern rules.
 */
type ImportPatternRuleOptions = readonly [
    {
        readonly allow?: readonly string[];
        readonly disallow?: readonly string[];
    }?,
];

const createImportVisitors = (
    context: Parameters<
        ReturnType<
            typeof ruleCreator<
                ImportPatternRuleOptions,
                ImportPatternMessageIds
            >
        >["create"]
    >[0],
    defaultDisallowPatterns: readonly string[]
): Record<string, (node: Readonly<es.Node>) => void> => ({
    "ImportDeclaration, ExportNamedDeclaration[source], ExportAllDeclaration, ImportExpression":
        (node: Readonly<es.Node>): void => {
            const sourceText = getImportSourceFromNode(node);
            if (sourceText === undefined) {
                return;
            }

            const [options = {}] = context.options;
            if (
                !shouldReportImportSource(
                    sourceText,
                    options,
                    defaultDisallowPatterns
                )
            ) {
                return;
            }

            context.report({
                data: {
                    source: sourceText,
                },
                messageId: "disallowedSource",
                node,
            });
        },
});

/**
 * Creates a rule that disallows import/export sources by glob pattern.
 *
 * @param options - Rule creation options.
 *
 * @returns ESLint rule module.
 */
export const createImportPatternRule = ({
    defaultDisallowPatterns,
    description,
    name,
}: Readonly<CreateImportPatternRuleOptions>): ReturnType<
    typeof ruleCreator<ImportPatternRuleOptions, ImportPatternMessageIds>
> =>
    ruleCreator<ImportPatternRuleOptions, ImportPatternMessageIds>({
        create: (context) =>
            createImportVisitors(context, defaultDisallowPatterns),
        defaultOptions: [{}],
        meta: {
            defaultOptions: [{}],
            docs: {
                description,
                recommended: false,
                url: `https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/${name}.md`,
            },
            hasSuggestions: false,
            messages: {
                disallowedSource:
                    "Import source `{{ source }}` is disallowed by this rule.",
            },
            schema: [
                {
                    additionalProperties: false,
                    properties: {
                        allow: {
                            items: {
                                type: "string",
                            },
                            type: "array",
                        },
                        disallow: {
                            items: {
                                type: "string",
                            },
                            type: "array",
                        },
                    },
                    type: "object",
                },
            ],
            type: "problem",
        },
        name,
    });

export type { ImportPatternRuleOptions };
