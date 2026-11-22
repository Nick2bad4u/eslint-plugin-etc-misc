import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayFirst, arrayLast } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "invalidFormat";

type Options = readonly [];

const isMultilineTemplate = (node: Readonly<es.TemplateLiteral>): boolean =>
    node.loc.start.line !== node.loc.end.line;

const hasExpectedBoundaryNewlines = (
    node: Readonly<es.TemplateLiteral>
): boolean => {
    const first = arrayFirst(node.quasis)?.value.raw ?? "";
    const last = arrayLast(node.quasis)?.value.raw ?? "";

    return first.startsWith("\n") && last.endsWith("\n");
};

/**
 * Enforce newline boundary formatting for multiline template literals.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        TemplateLiteral: (node: Readonly<es.TemplateLiteral>): void => {
            if (
                !isMultilineTemplate(node) ||
                hasExpectedBoundaryNewlines(node)
            ) {
                return;
            }

            context.report({
                messageId: "invalidFormat",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce newline boundary formatting for multiline template literals.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/template-literal-format",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            invalidFormat:
                "Multiline template literals must start and end on their own lines.",
        },
        schema: [],
        type: "layout",
    },
    name: "template-literal-format",
});

export default rule;
