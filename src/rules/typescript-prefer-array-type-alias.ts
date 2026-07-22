import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";
import {
    createReplacementRuleInfo,
    withDeprecatedRuleLifecycle,
} from "../_internal/rule-deprecation.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = String.raw`TSTypeAliasDeclaration > Identifier.id:matches([parent.typeAnnotation.type='TSArrayType'], [parent.typeAnnotation.type='TSTupleType']):not([name=/^(?:[A-Z][a-z\d]*)+(?:Array|s)$/u])`;

/**
 * Prefer reusable named aliases for array and tuple type aliases.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            context.report({
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
                "require reusable alias names for array and tuple type aliases.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-array-type-alias",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden:
                'Prefer a named alias ending in "Array" or "s" for array/tuple type aliases.',
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-array-type-alias",
});

/** Deprecated rule with explicit lifecycle and replacement metadata. */
const deprecatedRule: typeof rule = withDeprecatedRuleLifecycle(rule, {
    availableUntil: "4.0.0",
    deprecatedSince: "3.0.0",
    message:
        "Deprecated because typescript/consistent-array-type-name covers the same type-alias policy.",
    replacedBy: [
        createReplacementRuleInfo({
            rule: {
                name: "typescript/consistent-array-type-name",
                url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-consistent-array-type-name",
            },
        }),
    ],
    ruleId: "typescript/prefer-array-type-alias",
});

export default deprecatedRule;
