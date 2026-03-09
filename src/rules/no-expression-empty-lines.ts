import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const splitLines = (sourceText: string): readonly string[] =>
    sourceText.split(/\r?\n/u);

const hasBlankLine = (text: string): boolean =>
    splitLines(text).some((line) => line.trim().length === 0);

const normalizeExpressionSource = (sourceText: string): string => {
    const lines = splitLines(sourceText).map((line) => line.trimEnd());

    return lines.filter((line) => line.trim().length > 0).join("\n");
};

const createFix =
    (
        sourceCode: Readonly<TSESLint.SourceCode>,
        node: Readonly<es.ExpressionStatement>
    ): TSESLint.ReportFixFunction =>
    (fixer): TSESLint.RuleFix => {
        const sourceText = sourceCode.getText(node.expression);
        const replacement = `${normalizeExpressionSource(sourceText)};`;

        return fixer.replaceText(node, replacement);
    };

/**
 * Disallow blank lines inside expression statements.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        ExpressionStatement: (node: Readonly<es.ExpressionStatement>): void => {
            const sourceText = context.sourceCode.getText(node.expression);
            if (!hasBlankLine(sourceText)) {
                return;
            }

            context.report({
                fix: createFix(context.sourceCode, node),
                messageId: "forbidden",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        docs: {
            description: "disallow blank lines inside expression statements.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-expression-empty-lines.md",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Expression statement contains unnecessary blank lines.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-expression-empty-lines",
});

export default rule;
