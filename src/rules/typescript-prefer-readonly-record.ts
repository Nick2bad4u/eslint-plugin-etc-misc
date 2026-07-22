import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

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

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated in favor of the scoped readonly-record rules and @typescript-eslint/prefer-readonly-parameter-types.",
    replacedBy: [
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-record-property-type",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-property-type",
            },
        }),
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-record-return-type",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-return-type",
            },
        }),
        createReplacementRuleInfo({
            rule: {
                name: "typescript/require-readonly-record-type-alias",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-require-readonly-record-type-alias",
            },
        }),
        createReplacementRuleInfo({
            plugin: {
                name: "@typescript-eslint",
                url: "https://typescript-eslint.io/",
            },
            rule: {
                name: "prefer-readonly-parameter-types",
                url: "https://typescript-eslint.io/rules/prefer-readonly-parameter-types/",
            },
        }),
    ],
    ruleId: "typescript/prefer-readonly-record",
});

export default deprecatedRule;
