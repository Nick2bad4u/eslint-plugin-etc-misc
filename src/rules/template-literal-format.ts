import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import {
    arrayFirst,
    arrayJoin,
    arrayLast,
    isEmpty,
    stringSplit,
} from "ts-extras";

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

const normalizeTemplate = (sourceText: string): string => {
    const lines = stringSplit(sourceText.replaceAll(/\r\n?/gu, "\n"), "\n");
    const contentLines = lines.slice(1, -1);
    const indents = contentLines
        .filter((line) => line.trim().length > 0)
        .map((line) => /^\s*/u.exec(line)?.[0].length ?? 0);
    const minIndent = isEmpty(indents) ? 0 : Math.min(...indents);

    const normalizedContent = arrayJoin(
        contentLines
            .map((line) =>
                line.length >= minIndent ? line.slice(minIndent) : line
            )
            .map((line) => `  ${line}`),
        "\n"
    );

    const lastLine = arrayLast(lines) ?? "";

    return arrayJoin(
        [
            arrayFirst(lines),
            normalizedContent,
            lastLine,
        ],
        "\n"
    );
};

const buildFix =
    (
        sourceCode: Readonly<TSESLint.SourceCode>,
        node: Readonly<es.TemplateLiteral>
    ): TSESLint.ReportFixFunction =>
    (fixer): TSESLint.RuleFix => {
        const text = sourceCode.getText(node);
        return fixer.replaceText(node, normalizeTemplate(text));
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
                fix: buildFix(context.sourceCode, node),
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
        fixable: "code",
        hasSuggestions: false,
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
