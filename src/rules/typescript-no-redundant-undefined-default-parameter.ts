import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { arrayJoin, isDefined, isEmpty } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRemoveRedundantUndefined";

type Options = readonly [];

const functionLikeNodeSelector =
    ":matches(ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSConstructorType, TSDeclareFunction, TSEmptyBodyFunctionExpression, TSFunctionType, TSMethodSignature)";

const getParametersFromFunctionLikeNode = (
    node: Readonly<es.Node>
): Readonly<readonly es.Parameter[]> | undefined => {
    if (
        node.type === AST_NODE_TYPES.ArrowFunctionExpression ||
        node.type === AST_NODE_TYPES.FunctionDeclaration ||
        node.type === AST_NODE_TYPES.FunctionExpression ||
        node.type === AST_NODE_TYPES.TSCallSignatureDeclaration ||
        node.type === AST_NODE_TYPES.TSConstructSignatureDeclaration ||
        node.type === AST_NODE_TYPES.TSConstructorType ||
        node.type === AST_NODE_TYPES.TSDeclareFunction ||
        node.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression ||
        node.type === AST_NODE_TYPES.TSFunctionType ||
        node.type === AST_NODE_TYPES.TSMethodSignature
    ) {
        return node.params;
    }

    return undefined;
};

const getAssignmentPatternFromPattern = (
    pattern: Readonly<es.AssignmentPattern | es.BindingName | es.RestElement>
): Readonly<es.AssignmentPattern> | undefined => {
    if (pattern.type === AST_NODE_TYPES.AssignmentPattern) {
        return pattern;
    }

    if (pattern.type === AST_NODE_TYPES.RestElement) {
        return undefined;
    }

    return undefined;
};

const getAssignmentPatternFromParameter = (
    parameter: Readonly<es.Parameter>
): Readonly<es.AssignmentPattern> | undefined => {
    if (parameter.type === AST_NODE_TYPES.TSParameterProperty) {
        return getAssignmentPatternFromPattern(parameter.parameter);
    }

    return getAssignmentPatternFromPattern(parameter);
};

const getTypeAnnotationFromAssignmentPattern = (
    assignmentPattern: Readonly<es.AssignmentPattern>
): Readonly<es.TSTypeAnnotation> | undefined =>
    assignmentPattern.left.typeAnnotation;

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

    return unwrappedExpression.type === AST_NODE_TYPES.TemplateLiteral;
};

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

const createReplaceTypeFix =
    (
        targetNode: Readonly<es.Node>,
        replacementText: string
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix => {
        const [start, end] = targetNode.range;

        return fixer.replaceTextRange([start, end], replacementText);
    };

/**
 * Disallow redundant `undefined` unions on default parameters with
 * definitely-defined initializers.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [functionLikeNodeSelector]: (node: Readonly<es.Node>): void => {
                const parameters = getParametersFromFunctionLikeNode(node);

                if (parameters === undefined) {
                    return;
                }

                for (const parameter of parameters) {
                    const assignmentPattern =
                        getAssignmentPatternFromParameter(parameter);

                    if (assignmentPattern === undefined) {
                        continue;
                    }

                    if (
                        !isDefinitelyDefinedExpression(assignmentPattern.right)
                    ) {
                        continue;
                    }

                    const typeAnnotation =
                        getTypeAnnotationFromAssignmentPattern(
                            assignmentPattern
                        );

                    if (typeAnnotation === undefined) {
                        continue;
                    }

                    if (
                        typeAnnotation.typeAnnotation.type !==
                        AST_NODE_TYPES.TSUnionType
                    ) {
                        continue;
                    }

                    const fixedTypeText = buildFixedTypeText(
                        sourceCode,
                        typeAnnotation.typeAnnotation
                    );

                    if (!isDefined(fixedTypeText)) {
                        continue;
                    }

                    const fix = createReplaceTypeFix(
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
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "disallow redundant `undefined` in default parameter union types when the initializer is definitely defined.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-no-redundant-undefined-default-parameter",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden:
                "Default parameters with definitely-defined initializers should not redundantly include `undefined` in their type union.",
            suggestRemoveRedundantUndefined:
                "Remove redundant `undefined` from this default parameter type union.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/no-redundant-undefined-default-parameter",
});

export default rule;
