import type { TSESTree as es, TSESLint } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden" | "suggestRequireReadonlyRecordPropertyType";

type MutableRecordTypeReference = es.TSTypeReference & {
    readonly typeName: es.Identifier;
};

type Options = readonly [];

const isRecordTypeReference = (
    typeNode: Readonly<es.TypeNode>
): typeNode is Readonly<MutableRecordTypeReference> =>
    typeNode.type === "TSTypeReference" &&
    typeNode.typeName.type === "Identifier" &&
    typeNode.typeName.name === "Record";

const isReadonlyWrappedRecord = (
    typeReference: Readonly<es.TSTypeReference>
): boolean => {
    const maybeTypeParameterInstantiation = typeReference.parent;

    if (
        maybeTypeParameterInstantiation?.type !== "TSTypeParameterInstantiation"
    ) {
        return false;
    }

    const maybeReadonlyTypeReference = maybeTypeParameterInstantiation.parent;

    return (
        maybeReadonlyTypeReference?.type === "TSTypeReference" &&
        maybeReadonlyTypeReference.typeName.type === "Identifier" &&
        maybeReadonlyTypeReference.typeName.name === "Readonly"
    );
};

const collectMutableRecordTypeNodes = (
    typeNode: Readonly<es.TypeNode>
): readonly MutableRecordTypeReference[] => {
    if (
        typeNode.type === "TSIntersectionType" ||
        typeNode.type === "TSUnionType"
    ) {
        return typeNode.types.flatMap((subTypeNode) =>
            collectMutableRecordTypeNodes(subTypeNode)
        );
    }

    if (!isRecordTypeReference(typeNode) || isReadonlyWrappedRecord(typeNode)) {
        return [];
    }

    return [typeNode];
};

const buildReadonlyRecordFix =
    (
        node: Readonly<MutableRecordTypeReference>
    ): ((fixer: Readonly<TSESLint.RuleFixer>) => readonly TSESLint.RuleFix[]) =>
    (fixer: Readonly<TSESLint.RuleFixer>): readonly TSESLint.RuleFix[] => [
        fixer.replaceText(node.typeName, "Readonly<Record"),
        fixer.insertTextAfter(node, ">"),
    ];

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
 * Require readonly record property type annotations.
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

            const mutableRecordTypeNodes = collectMutableRecordTypeNodes(
                typeAnnotation.typeAnnotation
            );

            for (const mutableRecordTypeNode of mutableRecordTypeNodes) {
                const fix = buildReadonlyRecordFix(mutableRecordTypeNode);

                context.report({
                    fix,
                    messageId: "forbidden",
                    node: mutableRecordTypeNode.typeName,
                    suggest: [
                        {
                            fix,
                            messageId:
                                "suggestRequireReadonlyRecordPropertyType",
                        },
                    ],
                });
            }
        },
    }),
    defaultOptions: [],
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require Readonly<Record<...>> property type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-property-type",
        },
        fixable: "code",
        hasSuggestions: true,
        messages: {
            forbidden: "Prefer readonly record property types.",
            suggestRequireReadonlyRecordPropertyType:
                "Convert this property type to Readonly<Record<...>>.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/require-readonly-record-property-type",
});

export default rule;
