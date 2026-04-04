import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyMapParameterType";

type MutableMapTypeNode = es.Identifier;

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

const isMapTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> => node.typeName.type === "Identifier" && node.typeName.name === "Map";

const collectMutableMapTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableMapTypeNode[] => {
    if (
        typeNode.type === "TSIntersectionType" ||
        typeNode.type === "TSUnionType"
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableMapTypeNodes(subTypeNode)
        );
    }

    if (typeNode.type !== "TSTypeReference" || !isMapTypeReference(typeNode)) {
        return [];
    }

    return [typeNode.typeName];
};

const buildReadonlyMapFix =
    (
        node: Readonly<MutableMapTypeNode>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, "ReadonlyMap");

/**
 * Require readonly map parameter type annotations.
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

                const mutableMapTypeNodes = collectMutableMapTypeNodes(
                    typeAnnotation.typeAnnotation
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
                                messageId:
                                    "suggestRequireReadonlyMapParameterType",
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
            description: "require ReadonlyMap parameter type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-parameter-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly map parameter types.",
            suggestRequireReadonlyMapParameterType:
                "Convert this parameter type to ReadonlyMap.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-map-parameter-type",
});

export default rule;
