import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { arrayJoin, isEmpty  } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveRedundantUndefined";

type Options = readonly [];

const buildFixedTypeText = (
    sourceCode: Readonly<TSESLint.SourceCode>,
    unionType: Readonly<es.TSUnionType>
): string | undefined => {
    let nonUndefinedTypeTexts: readonly string[] = [];

    for (const typeNode of unionType.types) {
        if (typeNode.type === "TSUndefinedKeyword") {
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
): Readonly<es.TSTypeAnnotation> | undefined => {
    if (
        declarator.id.type === "Identifier" ||
        declarator.id.type === "ArrayPattern" ||
        declarator.id.type === "ObjectPattern"
    ) {
        return declarator.id.typeAnnotation;
    }

    return undefined;
};

const unwrapExpression = (
    expression: Readonly<es.Expression>
): Readonly<es.Expression> => {
    if (
        expression.type === "TSAsExpression" ||
        expression.type === "TSSatisfiesExpression" ||
        expression.type === "TSNonNullExpression" ||
        expression.type === "TSTypeAssertion"
    ) {
        return unwrapExpression(expression.expression);
    }

    return expression;
};

const isDefinitelyDefinedExpression = (
    expression: Readonly<es.Expression>
): boolean => {
    const unwrappedExpression = unwrapExpression(expression);

    if (unwrappedExpression.type === "ArrayExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ArrowFunctionExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ClassExpression") {
        return true;
    }

    if (unwrappedExpression.type === "FunctionExpression") {
        return true;
    }

    if (unwrappedExpression.type === "Literal") {
        return true;
    }

    if (unwrappedExpression.type === "NewExpression") {
        return true;
    }

    if (unwrappedExpression.type === "ObjectExpression") {
        return true;
    }

    if (unwrappedExpression.type === "TemplateLiteral") {
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
                if (node.type !== "VariableDeclarator") {
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

                if (typeAnnotation.typeAnnotation.type !== "TSUnionType") {
                    return;
                }

                const fixedTypeText = buildFixedTypeText(
                    sourceCode,
                    typeAnnotation.typeAnnotation
                );

                if (fixedTypeText === undefined) {
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
    defaultOptions: [],
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
