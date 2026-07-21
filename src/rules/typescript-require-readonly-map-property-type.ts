import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyMapPropertyType";

type MutableMapTypeNode = es.Identifier;

type Options = readonly [];

const isMapTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> =>
    node.typeName.type === AST_NODE_TYPES.Identifier &&
    node.typeName.name === "Map";

const collectMutableMapTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableMapTypeNode[] => {
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
        node: Readonly<MutableMapTypeNode>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, "ReadonlyMap");

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
 * Require readonly map property type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
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
                            messageId: "suggestRequireReadonlyMapPropertyType",
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
            description: "require ReadonlyMap property type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-map-property-type",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly map property types.",
            suggestRequireReadonlyMapPropertyType:
                "Convert this property type to ReadonlyMap.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-map-property-type",
});

export default rule;
