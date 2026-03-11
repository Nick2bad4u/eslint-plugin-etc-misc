import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyArrayReturnType";

type MutableArrayLikeTypeNode = es.Identifier | es.TSArrayType | es.TSTupleType;

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

const isArrayTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> => node.typeName.type === "Identifier" && node.typeName.name === "Array";

const collectMutableArrayLikeTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableArrayLikeTypeNode[] => {
    if (typeNode.type === "TSArrayType" || typeNode.type === "TSTupleType") {
        return [typeNode];
    }

    if (
        typeNode.type === "TSIntersectionType" ||
        typeNode.type === "TSUnionType"
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableArrayLikeTypeNodes(subTypeNode)
        );
    }

    if (typeNode.type === "TSTypeReference") {
        if (!isArrayTypeReference(typeNode)) {
            return [];
        }

        return [typeNode.typeName];
    }

    return [];
};

const buildReadonlyArrayLikeFix = (
    node: Readonly<MutableArrayLikeTypeNode>,
    sourceCode: Readonly<TSESLint.SourceCode>
): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) => {
    if (node.type === "Identifier") {
        return (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
            fixer.replaceText(node, "ReadonlyArray");
    }

    return (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, `readonly ${sourceCode.getText(node)}`);
};

/**
 * Require readonly array-like return type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            [functionLikeNodeSelector]: (node: Readonly<es.Node>): void => {
                const returnTypeAnnotation =
                    getReturnTypeAnnotationFromFunctionLikeNode(node);

                if (returnTypeAnnotation === undefined) {
                    return;
                }

                const mutableArrayLikeTypeNodes =
                    collectMutableArrayLikeTypeNodes(
                        returnTypeAnnotation.typeAnnotation
                    );

                for (const mutableArrayLikeTypeNode of mutableArrayLikeTypeNodes) {
                    const fix = buildReadonlyArrayLikeFix(
                        mutableArrayLikeTypeNode,
                        sourceCode
                    );

                    context.report({
                        fix,
                        messageId: "forbidden",
                        node: mutableArrayLikeTypeNode,
                        suggest: [
                            {
                                fix,
                                messageId:
                                    "suggestRequireReadonlyArrayReturnType",
                            },
                        ],
                    });
                }
            },
        };
    },
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require readonly array and tuple return type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-array-return-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly array-like return types.",
            suggestRequireReadonlyArrayReturnType:
                "Convert this return type to a readonly array-like form.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-array-return-type",
});

export default rule;
