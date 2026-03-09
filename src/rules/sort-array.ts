/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESLint fixer API callback signatures. */

import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "incorrectSorting";

type Options = readonly [];

const getSortableValue = (
    element: Readonly<es.Expression | es.SpreadElement>
): string | undefined => {
    if (element.type === "Literal") {
        return String(element.value);
    }

    return undefined;
};

const buildFix =
    (
        sourceCode: Readonly<TSESLint.SourceCode>,
        node: Readonly<es.ArrayExpression>,
        sorted: readonly (es.Expression | es.SpreadElement)[]
    ): TSESLint.ReportFixFunction =>
    (fixer): TSESLint.RuleFix => {
        const [first, last] = [node.elements[0], node.elements.at(-1)];
        if (
            first === null ||
            first === undefined ||
            last === null ||
            last === undefined
        ) {
            return fixer.replaceText(node, sourceCode.getText(node));
        }

        return fixer.replaceTextRange(
            [first.range[0], last.range[1]],
            sorted.map((element) => sourceCode.getText(element)).join(", ")
        );
    };

/**
 * Enforce alphabetical sorting for literal array elements.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        ArrayExpression: (node: Readonly<es.ArrayExpression>): void => {
            const elements: (es.Expression | es.SpreadElement)[] = [];
            for (const element of node.elements) {
                if (element !== null) {
                    elements.push(element);
                }
            }
            if (elements.length < 2) {
                return;
            }

            const sortKeys = elements.map((element) =>
                getSortableValue(element)
            );
            if (sortKeys.includes(undefined)) {
                return;
            }

            // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
            const sorted = [...elements].sort((a, b) =>
                (getSortableValue(a) ?? "").localeCompare(
                    getSortableValue(b) ?? ""
                )
            );
            const unchanged = elements.every(
                (element, index) => element === sorted[index]
            );
            if (unchanged) {
                return;
            }

            context.report({
                fix: buildFix(context.sourceCode, node, sorted),
                messageId: "incorrectSorting",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        docs: {
            description:
                "enforce alphabetical sorting for literal array elements.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/sort-array.md",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            incorrectSorting:
                "Array literal elements should be sorted alphabetically.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-array",
});

export default rule;
