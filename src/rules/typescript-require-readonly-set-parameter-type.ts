import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlySetParameterType";

type MutableSetTypeNode = es.Identifier;

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
    pattern: Readonly<es.AssignmentPattern | es.BindingName | es.RestElement>
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

const isSetTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> =>
    node.typeName.type === AST_NODE_TYPES.Identifier &&
    node.typeName.name === "Set";

const collectMutableSetTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableSetTypeNode[] => {
    if (
        typeNode.type === AST_NODE_TYPES.TSIntersectionType ||
        typeNode.type === AST_NODE_TYPES.TSUnionType
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableSetTypeNodes(subTypeNode)
        );
    }

    if (
        typeNode.type !== AST_NODE_TYPES.TSTypeReference ||
        !isSetTypeReference(typeNode)
    ) {
        return [];
    }

    return [typeNode.typeName];
};

const buildReadonlySetFix =
    (
        node: Readonly<MutableSetTypeNode>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, "ReadonlySet");

/**
 * Require readonly set parameter type annotations.
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

                const mutableSetTypeNodes = collectMutableSetTypeNodes(
                    typeAnnotation.typeAnnotation
                );

                for (const mutableSetTypeNode of mutableSetTypeNodes) {
                    const fix = buildReadonlySetFix(mutableSetTypeNode);

                    context.report({
                        fix,
                        messageId: "forbidden",
                        node: mutableSetTypeNode,
                        suggest: [
                            {
                                fix,
                                messageId:
                                    "suggestRequireReadonlySetParameterType",
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
            description: "require ReadonlySet parameter type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-parameter-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly set parameter types.",
            suggestRequireReadonlySetParameterType:
                "Convert this parameter type to ReadonlySet.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-set-parameter-type",
});

export default rule;
