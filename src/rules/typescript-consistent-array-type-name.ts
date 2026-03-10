import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = String.raw`:matches(TSTypeAliasDeclaration[typeAnnotation.type='TSArrayType'], TSTypeAliasDeclaration[typeAnnotation.type='TSTupleType'], TSTypeAliasDeclaration[typeAnnotation.type='TSTypeReference']:has(TSTypeReference > Identifier[name='Array'])) > Identifier.id:not([name=/^(?:[A-Z][a-z\d]*)+(?:Array|s)$/u])`;

/**
 * Require array-like type aliases to end with `Array` or `s`.
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
                "enforce consistent naming for array-like type aliases.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-consistent-array-type-name",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                'Use a name ending with "Array" or "s" for array-like type aliases.',
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/consistent-array-type-name",
});

export default rule;
