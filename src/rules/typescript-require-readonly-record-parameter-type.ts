import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

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

const getTypeAnnotationFromPattern = (
    pattern: Readonly<es.AssignmentPattern | es.BindingName | es.RestElement>
): Readonly<es.TSTypeAnnotation> | undefined => {
    if (pattern.type === "AssignmentPattern") {
        return getTypeAnnotationFromPattern(pattern.left);
    }

    if (pattern.type === "RestElement") {
        if (pattern.typeAnnotation !== undefined) {
            return pattern.typeAnnotation;
        }

        const argument = pattern.argument;

        if (
            argument.type !== "ArrayPattern" &&
            argument.type !== "Identifier" &&
            argument.type !== "ObjectPattern"
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
    if (parameter.type === "TSParameterProperty") {
        return getTypeAnnotationFromPattern(parameter.parameter);
    }

    return getTypeAnnotationFromPattern(parameter);
};

const isRecordTypeReference = (
    typeNode: Readonly<es.TypeNode>
): typeNode is Readonly<MutableRecordTypeReference> =>
    typeNode.type === "TSTypeReference" &&
    typeNode.typeName.type === "Identifier" &&
    typeNode.typeName.name === "Record";

const isReadonlyWrappedRecord = (
    typeReference: Readonly<es.TSTypeReference>
): boolean => {
    const maybeTypeParameterInstantiation = typeReference.parent;

    if (
        maybeTypeParameterInstantiation?.type !== "TSTypeParameterInstantiation"
    ) {
        return false;
    }

    const maybeReadonlyTypeReference = maybeTypeParameterInstantiation.parent;

    return (
        maybeReadonlyTypeReference?.type === "TSTypeReference" &&
        maybeReadonlyTypeReference.typeName.type === "Identifier" &&
        maybeReadonlyTypeReference.typeName.name === "Readonly"
    );
};

const collectMutableRecordTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableRecordTypeReference[] => {
    if (
        typeNode.type === "TSIntersectionType" ||
        typeNode.type === "TSUnionType"
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
    defaultOptions: [],
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
