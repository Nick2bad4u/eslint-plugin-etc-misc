import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayJoin, isDefined, isEmpty } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveRedundantUndefined";

type Options = readonly [];

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

const getTypeAnnotationFromDeclarator = (
    declarator: Readonly<es.VariableDeclarator>
): Readonly<es.TSTypeAnnotation> | undefined => declarator.id.typeAnnotation;

const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === AST_NODE_TYPES.TSAsExpression ||
        expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
        expression.type === AST_NODE_TYPES.TSNonNullExpression ||
        expression.type === AST_NODE_TYPES.TSTypeAssertion
    ) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

const isDefinitelyDefinedExpression = (
    expression: Readonly<es.Expression>
): boolean => {
    const unwrappedExpression = unwrapExpression(expression);

    if (unwrappedExpression.type === AST_NODE_TYPES.ArrayExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ArrowFunctionExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ClassExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.FunctionExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.Literal) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.NewExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.ObjectExpression) {
        return true;
    }

    if (unwrappedExpression.type === AST_NODE_TYPES.TemplateLiteral) {
        return true;
    }

    return false;
};

/**
 * Disallow redundant `undefined` unions on const declarations with
 * definitely-defined initializers.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            'VariableDeclaration[kind="const"] > VariableDeclarator': (
                node: Readonly<es.Node>
            ): void => {
                if (node.type !== AST_NODE_TYPES.VariableDeclarator) {
                    return;
                }

                if (node.init === null) {
                    return;
                }

                if (!isDefinitelyDefinedExpression(node.init)) {
                    return;
                }

                const typeAnnotation = getTypeAnnotationFromDeclarator(node);

                if (typeAnnotation === undefined) {
                    return;
                }

                if (
                    typeAnnotation.typeAnnotation.type !==
                    AST_NODE_TYPES.TSUnionType
                ) {
                    return;
                }

                const fixedTypeText = buildFixedTypeText(
                    sourceCode,
                    typeAnnotation.typeAnnotation
                );

                if (!isDefined(fixedTypeText)) {
                    return;
                }

                const fix = (
                    fixer: Readonly<TSESLint.RuleFixer>
                ): TSESLint.RuleFix =>
                    fixer.replaceText(
                        typeAnnotation.typeAnnotation,
                        fixedTypeText
                    );

                context.report({
                    fix,
                    messageId: "forbidden",
                    node: typeAnnotation.typeAnnotation,
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
                "disallow redundant `undefined` in const declaration union types when the initializer is definitely defined.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-const",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Const declarations with definitely-defined initializers should not redundantly include `undefined` in their type union.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this const declaration type union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-const",
});

export default rule;
