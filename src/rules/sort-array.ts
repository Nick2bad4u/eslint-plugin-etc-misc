/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESLint fixer API callback signatures. */

import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import {
    arrayAt,
    arrayFirst,
    arrayJoin,
    isDefined,
    isPresent,
} from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "incorrectSorting";

type Options = readonly [];

const getSortableValue = (
    element: Readonly<es.Expression | es.SpreadElement>
): string | undefined => {
    if (element.type === AST_NODE_TYPES.Literal) {
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
        const [first, last] = [
            arrayFirst(node.elements),
            arrayAt(node.elements, -1),
        ];
        if (!isPresent(first) || !isPresent(last)) {
            return fixer.replaceText(node, sourceCode.getText(node));
        }

        return fixer.replaceTextRange(
            [arrayFirst(first.range), last.range[1]],
            arrayJoin(
                sorted.map((element) => sourceCode.getText(element)),
                ", "
            )
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
            let elements: readonly (es.Expression | es.SpreadElement)[] = [];
            for (const element of node.elements) {
                if (element !== null) {
                    elements = [...elements, element];
                }
            }
            if (elements.length < 2) {
                return;
            }

            const sortKeys = elements.map((element) =>
                getSortableValue(element)
            );
            if (sortKeys.some((sortKey) => !isDefined(sortKey))) {
                return;
            }

            // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
            const sorted = [...elements].sort((a, b) =>
                (getSortableValue(a) ?? "").localeCompare(
                    getSortableValue(b) ?? ""
                )
            );
            const isUnchanged = elements.every(
                (element, index) => element === sorted[index]
            );
            if (isUnchanged) {
                return;
            }

            context.report({
                fix: buildFix(context.sourceCode, node, sorted),
                messageId: "incorrectSorting",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce alphabetical sorting for literal array elements.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-array",
        },
        fixable: "code",
        hasSuggestions: false,
        languages: ["js/js"],
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

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after file-scoped fixer callback implementations. */
