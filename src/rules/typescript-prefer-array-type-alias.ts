import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

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
    defaultOptions: [],
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
        messages: {
            forbidden:
                'Prefer a named alias ending in "Array" or "s" for array/tuple type aliases.',
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-array-type-alias",
});

export default rule;
