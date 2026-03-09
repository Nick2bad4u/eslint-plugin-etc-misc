import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "invalidFormat";

type Options = readonly [];

const isMultilineTemplate = (node: Readonly<es.TemplateLiteral>): boolean =>
    node.loc.start.line !== node.loc.end.line;

const hasExpectedBoundaryNewlines = (
    node: Readonly<es.TemplateLiteral>
): boolean => {
    const first = node.quasis[0]?.value.raw ?? "";
    // eslint-disable-next-line unicorn/prefer-at -- Node >=16.0 support baseline
    const last = node.quasis[node.quasis.length - 1]?.value.raw ?? "";

    return first.startsWith("\n") && last.endsWith("\n");
};

const normalizeTemplate = (sourceText: string): string => {
    const lines = sourceText.split(/\r?\n/u);
    const contentLines = lines.slice(1, -1);
    const indents = contentLines
        .filter((line) => line.trim().length > 0)
        .map((line) => /^\s*/u.exec(line)?.[0].length ?? 0);
    const minIndent = indents.length === 0 ? 0 : Math.min(...indents);

    const normalizedContent = contentLines
        .map((line) =>
            line.length >= minIndent ? line.slice(minIndent) : line
        )
        .map((line) => `  ${line}`)
        .join("\n");

    // eslint-disable-next-line unicorn/prefer-at -- Node >=16.0 support baseline
    const lastLine = lines[lines.length - 1] ?? "";

    return [
        lines[0],
        normalizedContent,
        lastLine,
    ].join("\n");
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
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "enforce newline boundary formatting for multiline template literals.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/template-literal-format.md",
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
