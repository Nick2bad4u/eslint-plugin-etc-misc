import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "inconsistent";

type Options = readonly [];

const splitLines = (sourceText: string): readonly string[] =>
    sourceText.split(/\r?\n/u);

const collapseEmptyLines = (sourceText: string): string => {
    const lines = splitLines(sourceText);
    const output: string[] = [];
    let emptyRun = 0;

    for (const line of lines) {
        const isEmpty = line.trim().length === 0;
        if (!isEmpty) {
            emptyRun = 0;
            output.push(line);
            continue;
        }

        if (emptyRun < 1) {
            output.push(line);
        }

        emptyRun += 1;
    }

    return output.join("\n");
};

const hasTooManyEmptyLines = (sourceText: string): boolean => {
    let emptyRun = 0;

    for (const line of splitLines(sourceText)) {
        if (line.trim().length === 0) {
            emptyRun += 1;
            if (emptyRun >= 2) {
                return true;
            }
        } else {
            emptyRun = 0;
        }
    }

    return false;
};

/**
 * Enforce at most one consecutive empty line.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        Program: (node: Readonly<es.Program>): void => {
            const sourceText = context.sourceCode.getText();
            if (!hasTooManyEmptyLines(sourceText)) {
                return;
            }

            context.report({
                fix: (fixer): TSESLint.RuleFix =>
                    fixer.replaceTextRange(
                        [0, sourceText.length],
                        collapseEmptyLines(sourceText)
                    ),
                messageId: "inconsistent",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "enforce at most one consecutive empty line.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/consistent-empty-lines",
        },
        fixable: "whitespace",
        hasSuggestions: false,
        messages: {
            inconsistent:
                "Consecutive empty lines should be collapsed to a single blank line.",
        },
        schema: [],
        type: "layout",
    },
    name: "consistent-empty-lines",
});

export default rule;
