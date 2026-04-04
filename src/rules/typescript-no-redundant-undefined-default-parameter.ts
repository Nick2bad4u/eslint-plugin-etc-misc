import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

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
        node.type === "ArrowFunctionExpression" ||
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "TSCallSignatureDeclaration" ||
        node.type === "TSConstructSignatureDeclaration" ||
        node.type === "TSConstructorType" ||
        node.type === "TSDeclareFunction" ||
        node.type === "TSEmptyBodyFunctionExpression" ||
        node.type === "TSFunctionType" ||
        node.type === "TSMethodSignature"
    ) {
        return node.params;
    }

    return undefined;
};

const getAssignmentPatternFromPattern = (
    pattern: Readonly<es.AssignmentPattern | es.BindingName | es.RestElement>
): Readonly<es.AssignmentPattern> | undefined => {
    if (pattern.type === "AssignmentPattern") {
        return pattern;
    }

    if (pattern.type === "RestElement") {
        return undefined;
    }

    return undefined;
};

const getAssignmentPatternFromParameter = (
    parameter: Readonly<es.Parameter>
): Readonly<es.AssignmentPattern> | undefined => {
    if (parameter.type === "TSParameterProperty") {
        return getAssignmentPatternFromPattern(parameter.parameter);
    }

    return getAssignmentPatternFromPattern(parameter);
};

const getTypeAnnotationFromAssignmentPattern = (
    assignmentPattern: Readonly<es.AssignmentPattern>
): Readonly<es.TSTypeAnnotation> | undefined => {
    if (
        assignmentPattern.left.type !== "ArrayPattern" &&
        assignmentPattern.left.type !== "Identifier" &&
        assignmentPattern.left.type !== "ObjectPattern"
    ) {
        return undefined;
    }

    return assignmentPattern.left.typeAnnotation;
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

                    if (typeAnnotation.typeAnnotation.type !== "TSUnionType") {
                        continue;
                    }

                    const fixedTypeText = buildFixedTypeText(
                        sourceCode,
                        typeAnnotation.typeAnnotation
                    );

                    if (!isDefined(fixedTypeText)) {
                        continue;
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
