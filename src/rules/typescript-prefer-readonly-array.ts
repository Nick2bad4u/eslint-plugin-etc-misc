import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = arrayJoin(
    [
        ":not(TSTypeOperator[operator='readonly']) > :matches(TSArrayType, TSTupleType)",
        "TSTypeReference > Identifier[name='Array']",
    ],
    ", "
);

/**
 * Require readonly array and tuple type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [selector]: (node: Readonly<es.Node>): void => {
                if (
                    node.type !== AST_NODE_TYPES.Identifier &&
                    node.type !== AST_NODE_TYPES.TSArrayType &&
                    node.type !== AST_NODE_TYPES.TSTupleType
                ) {
                    return;
                }

                const fix =
                    node.type === AST_NODE_TYPES.Identifier
                        ? (
                              fixer: Readonly<TSESLint.RuleFixer>
                          ): TSESLint.RuleFix =>
                              fixer.replaceText(node, "ReadonlyArray")
                        : (
                              fixer: Readonly<TSESLint.RuleFixer>
                          ): TSESLint.RuleFix =>
                              fixer.replaceText(
                                  node,
                                  `readonly ${sourceCode.getText(node)}`
                              );

                context.report({
                    fix,
                    messageId: "forbidden",
                    node,
                });
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require readonly array and tuple type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-array",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Prefer readonly array or tuple types.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-array",
});

export default rule;
