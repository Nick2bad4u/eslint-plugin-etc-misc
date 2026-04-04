import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlySetPropertyType";

type MutableSetTypeNode = es.Identifier;

type Options = readonly [];

const isSetTypeReference = (
    node: Readonly<es.TSTypeReference>
): node is Readonly<
    es.TSTypeReference & { readonly typeName: es.Identifier }
> => node.typeName.type === "Identifier" && node.typeName.name === "Set";

const collectMutableSetTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableSetTypeNode[] => {
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
        node: Readonly<MutableSetTypeNode>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => TSESLint.RuleFix) =>
    (fixer: Readonly<TSESLint.RuleFixer>): TSESLint.RuleFix =>
        fixer.replaceText(node, "ReadonlySet");

const isTopLevelPropertySignature = (
    node: Readonly<es.TSPropertySignature>
): boolean => {
    const parent = node.parent;

    if (parent?.type === "TSInterfaceBody") {
        return true;
    }

    if (parent?.type !== "TSTypeLiteral") {
        return false;
    }

    const maybeTypeAliasDeclaration = parent.parent;

    return maybeTypeAliasDeclaration?.type === "TSTypeAliasDeclaration";
};

/**
 * Require readonly set property type annotations.
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
                            messageId: "suggestRequireReadonlySetPropertyType",
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
            description: "require ReadonlySet property type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-set-property-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly set property types.",
            suggestRequireReadonlySetPropertyType:
                "Convert this property type to ReadonlySet.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-set-property-type",
});

export default rule;
