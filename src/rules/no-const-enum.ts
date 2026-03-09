import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [
    {
        readonly allowLocal?: boolean;
    }?,
];

const defaultOptions: Options = [{}];

const isExportedEnumDeclaration = (
    node: Readonly<es.TSEnumDeclaration>
): boolean => node.parent?.type === "ExportNamedDeclaration";

/**
 * Disallow `const enum` declarations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        TSEnumDeclaration: (node: Readonly<es.TSEnumDeclaration>) => {
            if (!node.const) {
                return;
            }

            const [{ allowLocal = false } = {}] = context.options;
            if (allowLocal && !isExportedEnumDeclaration(node)) {
                return;
            }

            context.report({
                messageId: "forbidden",
                node: node.id,
            });
        },
    }),
    defaultOptions,
    meta: {
        defaultOptions: [{}],
        docs: {
            description: "disallow const enum declarations.",
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-const-enum",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "`const enum` declarations are forbidden.",
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
