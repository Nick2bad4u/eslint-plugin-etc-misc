import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveConst";

type Options = readonly [
    {
        readonly allowLocal?: boolean;
    }?,
];

const defaultOptions: Options = [{}];

const isExportedEnumDeclaration = (
    node: Readonly<es.TSEnumDeclaration>
): boolean => node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration;

const getConstToken = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.TSEnumDeclaration>
) =>
    sourceCode.getFirstToken(node, {
        filter: (token): boolean => token.value === "const",
    }) ?? undefined;

/**
 * Disallow `const enum` declarations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            TSEnumDeclaration: (node: Readonly<es.TSEnumDeclaration>) => {
                if (!node.const) {
                    return;
                }

                const [{ allowLocal = false } = {}] = context.options;
                if (allowLocal && !isExportedEnumDeclaration(node)) {
                    return;
                }

                const constToken = getConstToken(sourceCode, node);
                const fix: TSESLint.ReportFixFunction | undefined =
                    constToken === undefined
                        ? undefined
                        : (fixer) => {
                              let tokenRemovalEnd = constToken.range[1];
                              while (
                                  tokenRemovalEnd < sourceCode.text.length &&
                                  (sourceCode.text.at(tokenRemovalEnd) ===
                                      " " ||
                                      sourceCode.text.at(tokenRemovalEnd) ===
                                          "\t")
                              ) {
                                  tokenRemovalEnd += 1;
                              }

                              return fixer.removeRange([
                                  arrayFirst(constToken.range),
                                  tokenRemovalEnd,
                              ]);
                          };

                context.report({
                    messageId: "forbidden",
                    node: node.id,
                    ...(fix !== undefined && {
                        fix,
                        suggest: [
                            {
                                fix,
                                messageId: "suggestRemoveConst",
                            },
                        ],
                    }),
                });
            },
        };
    },
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow const enum declarations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-const-enum",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden: "`const enum` declarations are forbidden.",
            suggestRemoveConst:
                "Remove the const modifier from this enum declaration.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for allowing non-exported const enum declarations.",
                properties: {
                    allowLocal: {
                        description:
                            "Allow const enum declarations when they are not exported.",
                        type: "boolean",
                    },
                },
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "no-const-enum",
});

export default rule;
