import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyArrayPropertyType";

type MutableArrayLikeTypeNode =
    | es.Identifier
    | es.TSArrayType
    | es.TSTupleType;

type Options = readonly [];

const isArrayTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> =>
    node.typeName.type === AST_NODE_TYPES.Identifier &&
    node.typeName.name === "Array";

const collectMutableArrayLikeTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableArrayLikeTypeNode[] => {
    if (
        typeNode.type === AST_NODE_TYPES.TSArrayType ||
        typeNode.type === AST_NODE_TYPES.TSTupleType
    ) {
        return [typeNode];
    }

    if (
        typeNode.type === AST_NODE_TYPES.TSIntersectionType ||
        typeNode.type === AST_NODE_TYPES.TSUnionType
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableArrayLikeTypeNodes(subTypeNode)
        );
    }

    if (typeNode.type === AST_NODE_TYPES.TSTypeReference) {
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
    if (node.type === AST_NODE_TYPES.Identifier) {
        return (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
            fixer.replaceText(node, "ReadonlyArray");
    }

    return (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, `readonly ${sourceCode.getText(node)}`);
};

const isTopLevelPropertySignature = (
    node: Readonly<es.TSPropertySignature>
): boolean => {
    const parent = node.parent;

    if (parent.type === AST_NODE_TYPES.TSInterfaceBody) {
        return true;
    }
    const maybeTypeAliasDeclaration = parent.parent;

    return (
        maybeTypeAliasDeclaration.type === AST_NODE_TYPES.TSTypeAliasDeclaration
    );
};

/**
 * Require readonly array-like property type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            "TSPropertySignature[typeAnnotation!=null]": (
                node: Readonly<es.TSPropertySignature>
            ): void => {
                if (!isTopLevelPropertySignature(node)) {
                    return;
                }

                const typeAnnotation = node.typeAnnotation;

                if (typeAnnotation === undefined) {
                    return;
                }

                const mutableArrayLikeTypeNodes =
                    collectMutableArrayLikeTypeNodes(
                        typeAnnotation.typeAnnotation
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
                                    "suggestRequireReadonlyArrayPropertyType",
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
                "require readonly array and tuple property type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-array-property-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly array-like property types.",
            suggestRequireReadonlyArrayPropertyType:
                "Convert this property type to a readonly array-like form.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-array-property-type",
});

export default rule;
