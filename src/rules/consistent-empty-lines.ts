import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayJoin, stringSplit } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "inconsistent";

type Options = readonly [];

const splitLines = (sourceText: string): readonly string[] =>
    stringSplit(sourceText.replaceAll(/\r\n?/gv, "\n"), "\n");

const collapseEmptyLines = (sourceText: string): string => {
    const lines = splitLines(sourceText);
    let output: readonly string[] = [];
    let emptyRun = 0;

    for (const line of lines) {
        const isEmpty = line.trim().length === 0;
        if (!isEmpty) {
            emptyRun = 0;
            output = [...output, line];
            continue;
        }

        if (emptyRun < 1) {
            output = [...output, line];
        }

        emptyRun += 1;
    }

    return arrayJoin(output, "\n");
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
        languages: ["js/js"],
        messages: {
            inconsistent:
                "Consecutive empty lines should be collapsed to a single blank line.",
        },
        schema: [],
        type: "layout",
    },
    name: "consistent-empty-lines",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message: "Deprecated in favor of @stylistic/no-multiple-empty-lines.",
    replacedBy: [
        createReplacementRuleInfo({
            plugin: {
                name: "@stylistic",
                url: "https://eslint.style/",
            },
            rule: {
                name: "no-multiple-empty-lines",
                url: "https://eslint.style/rules/no-multiple-empty-lines",
            },
        }),
    ],
    ruleId: "consistent-empty-lines",
});

export default deprecatedRule;
