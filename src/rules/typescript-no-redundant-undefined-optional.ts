import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayJoin, isDefined, isEmpty } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveRedundantUndefined";

type Options = readonly [];

const selector = arrayJoin(
    [
        "Identifier[optional=true] > TSTypeAnnotation > TSUnionType",
        "TSNamedTupleMember[optional=true] > TSUnionType",
        "TSOptionalType > TSUnionType",
    ],
    ", "
);

const buildFixedTypeText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    unionType: Readonly<es.TSUnionType>
): string | undefined => {
    let nonUndefinedTypeTexts: readonly string[] = [];

    for (const typeNode of unionType.types) {
        if (typeNode.type === AST_NODE_TYPES.TSUndefinedKeyword) {
            continue;
        }

        nonUndefinedTypeTexts = [
            ...nonUndefinedTypeTexts,
            sourceCode.getText(typeNode),
        ];
    }

    if (
        isEmpty(nonUndefinedTypeTexts) ||
        nonUndefinedTypeTexts.length === unionType.types.length
    ) {
        return undefined;
    }

    return arrayJoin(nonUndefinedTypeTexts, " | ");
};

/**
 * Disallow redundant `undefined` unions on optional parameters and tuple
 * members.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [selector]: (node: Readonly<es.Node>): void => {
                if (node.type !== AST_NODE_TYPES.TSUnionType) {
                    return;
                }

                const fixedTypeText = buildFixedTypeText(sourceCode, node);

                if (!isDefined(fixedTypeText)) {
                    return;
                }

                const fix = (
                    fixer: Readonly<TSESLint.RuleFixer>
                ): TSESLint.RuleFix => fixer.replaceText(node, fixedTypeText);

                context.report({
                    fix,
                    messageId: "forbidden",
                    node,
                    suggest: [
                        {
                            fix,
                            messageId: "suggestRemoveRedundantUndefined",
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
            description:
                "disallow redundant `undefined` in optional parameter and tuple member union types.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-optional",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden:
                "Optional parameters and tuple members should not redundantly include `undefined` in their type union.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this optional union type.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-optional",
});

export default rule;
