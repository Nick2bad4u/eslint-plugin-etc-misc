import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyRecordReturnType";

type MutableRecordTypeReference = es.TSTypeReference & {
    readonly typeName: es.Identifier;
};

type Options = readonly [];

const functionLikeNodeSelector =
    ":matches(ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSConstructorType, TSDeclareFunction, TSEmptyBodyFunctionExpression, TSFunctionType, TSMethodSignature)";

const getReturnTypeAnnotationFromFunctionLikeNode = (
    node: Readonly<es.Node>
): Readonly<es.TSTypeAnnotation> | undefined => {
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
        return node.returnType;
    }

    return undefined;
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
 * Require readonly record return type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [functionLikeNodeSelector]: (node: Readonly<es.Node>): void => {
            const returnTypeAnnotation =
                getReturnTypeAnnotationFromFunctionLikeNode(node);

            if (returnTypeAnnotation === undefined) {
                return;
            }

            const mutableRecordTypeNodes = collectMutableRecordTypeNodes(
                returnTypeAnnotation.typeAnnotation
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
                            messageId: "suggestRequireReadonlyRecordReturnType",
                        },
                    ],
                });
            }
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require Readonly<Record<...>> return type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-return-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly record return types.",
            suggestRequireReadonlyRecordReturnType:
                "Convert this return type to Readonly<Record<...>>.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-record-return-type",
});

export default rule;
