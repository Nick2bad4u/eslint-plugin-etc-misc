import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyArrayTypeAlias";

type MutableArrayLikeTypeNode = es.Identifier | es.TSArrayType | es.TSTupleType;

type Options = readonly [];

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
 * Require readonly array-like type aliases.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => {
        const sourceCode = context.sourceCode;

        return {
            TSTypeAliasDeclaration: (
                node: Readonly<es.TSTypeAliasDeclaration>
            ): void => {
                const mutableArrayLikeTypeNodes =
                    collectMutableArrayLikeTypeNodes(node.typeAnnotation);

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
                                    "suggestRequireReadonlyArrayTypeAlias",
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
                "require readonly array and tuple type alias annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-array-type-alias",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly array-like type aliases.",
            suggestRequireReadonlyArrayTypeAlias:
                "Convert this type alias annotation to a readonly array-like form.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-array-type-alias",
});

export default rule;
