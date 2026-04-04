import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayFirst, isDefined } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemove";

type Options = readonly [];

const disallowedSelector = "SwitchCase:last-child > BreakStatement.consequent";

const createTrailingBreakRemovalFix = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    node: Readonly<es.BreakStatement>
): TSESLint.ReportFixFunction => {
    const previousToken = sourceCode.getTokenBefore(node);
    const previousTokenLine = previousToken?.loc.end.line;
    const breakLine = node.loc.start.line;
    const shouldRemoveLeadingWhitespace =
        isDefined(previousTokenLine) && previousTokenLine === breakLine;

    if (previousToken === null || !shouldRemoveLeadingWhitespace) {
        return (fixer) => fixer.remove(node);
    }

    const leadingText = sourceCode.text.slice(
        previousToken.range[1],
        arrayFirst(node.range)
    );
    const leadingWhitespaceLength =
        /^[\t ]*/u.exec(leadingText)?.[0].length ?? 0;

    return (fixer) =>
        fixer.removeRange([
            arrayFirst(node.range) - leadingWhitespaceLength,
            node.range[1],
        ]);
};

/**
 * Disallow unnecessary trailing break statements in switch blocks.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [disallowedSelector]: (node: Readonly<es.Node>): void => {
                if (node.type !== "BreakStatement" || node.label !== null) {
                    return;
                }

                const fix = createTrailingBreakRemovalFix(sourceCode, node);

                context.report({
                    fix,
                    messageId: "forbidden",
                    node,
                    suggest: [
                        {
                            fix,
                            messageId: "suggestRemove",
                        },
                    ],
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow unnecessary trailing break statements.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-unnecessary-break",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Unnecessary break statement at end of switch case list.",
            suggestRemove:
                "Remove the trailing break statement because it is unreachable.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-break",
});

export default rule;
