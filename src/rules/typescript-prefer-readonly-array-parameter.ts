import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestPreferReadonlyArrayParameter";

type MutableArrayLikeTypeNode = es.Identifier | es.TSArrayType | es.TSTupleType;

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
 * Prefer readonly array-like parameter type annotations.
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
                    const typeAnnotation =
                        getTypeAnnotationFromParameter(parameter);

                    if (typeAnnotation === undefined) {
                        continue;
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
                                        "suggestPreferReadonlyArrayParameter",
                                },
                            ],
                        });
                    }
                }
            },
        };
    },
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require readonly array and tuple parameter type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-array-parameter",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly array-like parameter types.",
            suggestPreferReadonlyArrayParameter:
                "Convert this parameter type to a readonly array-like form.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-array-parameter",
});

export default rule;
