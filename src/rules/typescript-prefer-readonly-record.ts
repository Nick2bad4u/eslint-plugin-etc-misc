import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSTypeReference > Identifier[name='Record']";

const isReadonlyWrappedRecord = (
    typeReference: Readonly<es.TSTypeReference>
): boolean => {
    const parent = typeReference.parent;

    if (parent.type !== AST_NODE_TYPES.TSTypeParameterInstantiation) {
        return false;
    }

    const maybeReadonlyTypeReference = parent.parent;

    return (
        maybeReadonlyTypeReference.type === AST_NODE_TYPES.TSTypeReference &&
        maybeReadonlyTypeReference.typeName.type ===
            AST_NODE_TYPES.Identifier &&
        maybeReadonlyTypeReference.typeName.name === "Readonly"
    );
};

/**
 * Require readonly wrappers around bare Record type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== AST_NODE_TYPES.Identifier) {
                return;
            }

            const typeReference = node.parent;

            if (
                typeReference.type !== AST_NODE_TYPES.TSTypeReference ||
                typeReference.typeName.type !== AST_NODE_TYPES.Identifier ||
                typeReference.typeName.name !== "Record" ||
                isReadonlyWrappedRecord(typeReference)
            ) {
                return;
            }

            context.report({
                fix: (fixer) => [
                    fixer.replaceText(node, "Readonly<Record"),
                    fixer.insertTextAfter(typeReference, ">"),
                ],
                messageId: "forbidden",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require Readonly<Record<...>> instead of Record<...> in type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-record",
        },
        fixable: "code",
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Prefer readonly record types.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-record",
});

export default rule;
