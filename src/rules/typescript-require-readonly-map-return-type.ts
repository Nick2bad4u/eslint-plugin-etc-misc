import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyMapReturnType";

type Options = readonly [];

const functionLikeNodeSelector =
    ":matches(ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSConstructorType, TSDeclareFunction, TSEmptyBodyFunctionExpression, TSFunctionType, TSMethodSignature)";

const getReturnTypeAnnotationFromFunctionLikeNode = (
    node: Readonly<es.Node>
): Readonly<es.TSTypeAnnotation> | undefined => {
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
        return node.returnType;
    }

    return undefined;
};

const isMapTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> =>
    node.typeName.type === AST_NODE_TYPES.Identifier &&
    node.typeName.name === "Map";

const collectMutableMapTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly es.Identifier[] => {
    if (
        typeNode.type === AST_NODE_TYPES.TSIntersectionType ||
        typeNode.type === AST_NODE_TYPES.TSUnionType
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableMapTypeNodes(subTypeNode)
        );
    }

    if (
        typeNode.type !== AST_NODE_TYPES.TSTypeReference ||
        !isMapTypeReference(typeNode)
    ) {
        return [];
    }

    return [typeNode.typeName];
};

const buildReadonlyMapFix =
    (
        node: Readonly<es.Identifier>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, "ReadonlyMap");

/**
 * Require readonly map return type annotations.
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

            const mutableMapTypeNodes = collectMutableMapTypeNodes(
                returnTypeAnnotation.typeAnnotation
            );

            for (const mutableMapTypeNode of mutableMapTypeNodes) {
                const fix = buildReadonlyMapFix(mutableMapTypeNode);

                context.report({
                    fix,
                    messageId: "forbidden",
                    node: mutableMapTypeNode,
                    suggest: [
                        {
                            fix,
                            messageId: "suggestRequireReadonlyMapReturnType",
                        },
                    ],
                });
            }
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require ReadonlyMap return type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-return-type",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly map return types.",
            suggestRequireReadonlyMapReturnType:
                "Convert this return type to ReadonlyMap.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-map-return-type",
});

export default rule;
