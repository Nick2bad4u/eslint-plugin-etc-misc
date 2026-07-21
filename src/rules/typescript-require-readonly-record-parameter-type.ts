import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyRecordParameterType";

type MutableRecordTypeReference = es.TSTypeReference & {
    readonly typeName: es.Identifier;
};

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

const getTypeAnnotationFromPattern = (
    pattern: Readonly<
        | es.AssignmentPattern
        | es.BindingName
        | es.RestElement
    >
): Readonly<es.TSTypeAnnotation> | undefined => {
    if (pattern.type === AST_NODE_TYPES.AssignmentPattern) {
        return getTypeAnnotationFromPattern(pattern.left);
    }

    if (pattern.type === AST_NODE_TYPES.RestElement) {
        if (pattern.typeAnnotation !== undefined) {
            return pattern.typeAnnotation;
        }

        const argument = pattern.argument;

        if (
            argument.type !== AST_NODE_TYPES.ArrayPattern &&
            argument.type !== AST_NODE_TYPES.Identifier &&
            argument.type !== AST_NODE_TYPES.ObjectPattern
        ) {
            return undefined;
        }

        return argument.typeAnnotation;
    }

    return pattern.typeAnnotation;
};

const getTypeAnnotationFromParameter = (
    parameter: Readonly<es.Parameter>
): Readonly<es.TSTypeAnnotation> | undefined => {
    if (parameter.type === AST_NODE_TYPES.TSParameterProperty) {
        return getTypeAnnotationFromPattern(parameter.parameter);
    }

    return getTypeAnnotationFromPattern(parameter);
};

const isRecordTypeReference = (
    typeNode: Readonly<es.TypeNode>
): typeNode is Readonly<MutableRecordTypeReference> =>
    typeNode.type === AST_NODE_TYPES.TSTypeReference &&
    typeNode.typeName.type === AST_NODE_TYPES.Identifier &&
    typeNode.typeName.name === "Record";

const isReadonlyWrappedRecord = (
    typeReference: Readonly<es.TSTypeReference>
): boolean => {
    const maybeTypeParameterInstantiation = typeReference.parent;

    if (
        maybeTypeParameterInstantiation.type !==
        AST_NODE_TYPES.TSTypeParameterInstantiation
    ) {
        return false;
    }

    const maybeReadonlyTypeReference = maybeTypeParameterInstantiation.parent;

    return (
        maybeReadonlyTypeReference.type === AST_NODE_TYPES.TSTypeReference &&
        maybeReadonlyTypeReference.typeName.type ===
            AST_NODE_TYPES.Identifier &&
        maybeReadonlyTypeReference.typeName.name === "Readonly"
    );
};

const collectMutableRecordTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableRecordTypeReference[] => {
    if (
        typeNode.type === AST_NODE_TYPES.TSIntersectionType ||
        typeNode.type === AST_NODE_TYPES.TSUnionType
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableRecordTypeNodes(subTypeNode)
        );
    }

    if (!isRecordTypeReference(typeNode) || isReadonlyWrappedRecord(typeNode)) {
        return [];
    }

    return [typeNode];
};

const buildReadonlyRecordFix =
    (
        node: Readonly<MutableRecordTypeReference>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => readonly TSESLint.RuleFix[]) =>
    (fixer: Readonly<TSESLint.RuleFixer>): readonly TSESLint.RuleFix[] => [
        fixer.replaceText(node.typeName, "Readonly<Record"),
        fixer.insertTextAfter(node, ">"),
    ];

/**
 * Require readonly record parameter type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [functionLikeNodeSelector]: (node: Readonly<es.Node>): void => {
            const parameters = getParametersFromFunctionLikeNode(node);

            if (parameters === undefined) {
                return;
            }

            for (const parameter of parameters) {
                const typeAnnotation =
                    getTypeAnnotationFromParameter(parameter);

                if (typeAnnotation === undefined) {
                    continue;
                }

                const mutableRecordTypeNodes = collectMutableRecordTypeNodes(
                    typeAnnotation.typeAnnotation
                );

                for (const mutableRecordTypeNode of mutableRecordTypeNodes) {
                    const fix = buildReadonlyRecordFix(mutableRecordTypeNode);

                    context.report({
                        fix,
                        messageId: "forbidden",
                        node: mutableRecordTypeNode.typeName,
                        suggest: [
                            {
                                fix,
                                messageId:
                                    "suggestRequireReadonlyRecordParameterType",
                            },
                        ],
                    });
                }
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require Readonly<Record<...>> parameter type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-parameter-type",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly record parameter types.",
            suggestRequireReadonlyRecordParameterType:
                "Convert this parameter type to Readonly<Record<...>>.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-record-parameter-type",
});

export default rule;
