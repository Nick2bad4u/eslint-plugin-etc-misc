import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayJoin, stringSplit } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const splitLines = (sourceText: string): readonly string[] =>
    stringSplit(sourceText.replaceAll(/\r\n?/gv, "\n"), "\n");

const hasBlankLine = (text: string): boolean =>
    splitLines(text).some((line) => line.trim().length === 0);

const normalizeExpressionSource = (sourceText: string): string => {
    const lines = splitLines(sourceText).map((line) => line.trimEnd());

    return arrayJoin(
        lines.filter((line) => line.trim().length > 0),
        "\n"
    );
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
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow blank lines inside expression statements.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-expression-empty-lines",
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
