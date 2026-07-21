import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlySetTypeAlias";

type MutableSetTypeNode = es.Identifier;

type Options = readonly [];

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
 * Require readonly set type aliases.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        TSTypeAliasDeclaration: (
            node: Readonly<es.TSTypeAliasDeclaration>
        ): void => {
            const mutableSetTypeNodes = collectMutableSetTypeNodes(
                node.typeAnnotation
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
                            messageId: "suggestRequireReadonlySetTypeAlias",
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
            description: "require ReadonlySet type alias annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-type-alias",
        },
        fixable: "code",
        hasSuggestions: true,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly set type aliases.",
            suggestRequireReadonlySetTypeAlias:
                "Convert this type alias annotation to ReadonlySet.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-set-type-alias",
});

export default rule;
