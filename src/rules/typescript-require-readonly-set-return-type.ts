import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlySetReturnType";

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

const isSetTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> => node.typeName.type === "Identifier" && node.typeName.name === "Set";

const collectMutableSetTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly es.Identifier[] => {
    if (
        typeNode.type === "TSIntersectionType" ||
        typeNode.type === "TSUnionType"
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableSetTypeNodes(subTypeNode)
        );
    }

    if (typeNode.type !== "TSTypeReference" || !isSetTypeReference(typeNode)) {
        return [];
    }

    return [typeNode.typeName];
};

const buildReadonlySetFix =
    (
        node: Readonly<es.Identifier>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, "ReadonlySet");

/**
 * Require readonly set return type annotations.
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

            const mutableSetTypeNodes = collectMutableSetTypeNodes(
                returnTypeAnnotation.typeAnnotation
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
                            messageId: "suggestRequireReadonlySetReturnType",
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
            description: "require ReadonlySet return type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-return-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly set return types.",
            suggestRequireReadonlySetReturnType:
                "Convert this return type to ReadonlySet.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-set-return-type",
});

export default rule;
