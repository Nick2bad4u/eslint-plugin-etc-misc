/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types -- ESLint fixer API callback signatures. */

import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayFirst, arrayJoin, arrayLast } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "incorrectSortingOrder";

type Options = readonly [];

const toName = (specifier: Readonly<es.ExportSpecifier>): string =>
    specifier.exported.type === AST_NODE_TYPES.Identifier
        ? specifier.exported.name
        : specifier.exported.value;

const buildFix = (
    fixer: TSESLint.RuleFixer,
    node: Readonly<es.ExportNamedDeclaration>,
    sourceCode: Readonly<TSESLint.SourceCode>,
    sorted: readonly es.ExportSpecifier[]
): TSESLint.RuleFix => {
    const startRange = arrayFirst(node.specifiers)?.range ?? node.range;
    const endRange = arrayLast(node.specifiers)?.range ?? node.range;

    return fixer.replaceTextRange(
        [arrayFirst(startRange), arrayLast(endRange)],
        arrayJoin(
            sorted.map((specifier) => sourceCode.getText(specifier)),
            ", "
        )
    );
};

/**
 * Enforce alphabetical sorting of named export specifiers.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        ExportNamedDeclaration: (
            node: Readonly<es.ExportNamedDeclaration>
        ): void => {
            let exportSpecifiers: readonly es.ExportSpecifier[] = [];
            for (const specifier of node.specifiers) {
                exportSpecifiers = [...exportSpecifiers, specifier];
            }
            if (exportSpecifiers.length < 2) {
                return;
            }

            // eslint-disable-next-line unicorn/no-array-sort -- Node >=16.0 support baseline
            const sorted = [...exportSpecifiers].sort((a, b) =>
                toName(a).localeCompare(toName(b))
            );
            const unchanged = exportSpecifiers.every(
                (specifier, index) => specifier === sorted[index]
            );
            if (unchanged) {
                return;
            }

            context.report({
                fix: (fixer) =>
                    buildFix(fixer, node, context.sourceCode, sorted),
                messageId: "incorrectSortingOrder",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "enforce alphabetical sorting of named export specifiers.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-export-specifiers",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            incorrectSortingOrder:
                "Named export specifiers should be sorted alphabetically.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-export-specifiers",
});

export default rule;

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types -- Re-enable after file-scoped fixer callback implementations. */
