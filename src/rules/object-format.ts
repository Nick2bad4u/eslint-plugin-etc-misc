import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "inconsistent";

type Options = readonly [
    Readonly<{
        readonly maxProperties?: number;
    }>,
];

const isSingleLine = (node: Readonly<es.ObjectExpression>): boolean =>
    node.loc.start.line === node.loc.end.line;

/**
 * Enforce object literal line format based on configured property count.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context, [options]) => ({
        ObjectExpression: (node: Readonly<es.ObjectExpression>): void => {
            const maxProperties = options.maxProperties ?? 1;
            if (node.properties.length <= 1) {
                return;
            }

            const shouldBeSingleLine = node.properties.length <= maxProperties;
            const singleLine = isSingleLine(node);
            if (singleLine === shouldBeSingleLine) {
                return;
            }

            context.report({
                data: {
                    expected: shouldBeSingleLine ? "single-line" : "multi-line",
                },
                messageId: "inconsistent",
                node,
            });
        },
    }),
    defaultOptions: [{ maxProperties: 1 }],
    meta: {
        defaultOptions: [{ maxProperties: 1 }],
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce object literal line format based on property count.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/object-format",
        },
        hasSuggestions: false,
        messages: {
            inconsistent:
                "Object literal should use {{expected}} formatting for this size.",
        },
        schema: [
            {
                additionalProperties: false,
                description:
                    "Configuration for object literal line formatting thresholds.",
                properties: {
                    maxProperties: {
                        description:
                            "Maximum number of properties allowed on one line.",
                        minimum: 0,
                        type: "number",
                    },
                },
                type: "object",
            },
        ],
        type: "layout",
    },
    name: "object-format",
});

export default rule;
