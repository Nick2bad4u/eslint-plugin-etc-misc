import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "VariableDeclarator > TSAsExpression[expression.properties.length=0] > TSTypeReference > Identifier[name='const'], VariableDeclarator[id.typeAnnotation] > TSAsExpression > TSTypeReference > Identifier[name='const']";

/**
 * Disallow unnecessary `as const` assertions.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [disallowedSelector]: (node: Readonly<es.Node>): void => {
            context.report({
                messageId: "forbidden",
                node,
            });
        },
    }),
    defaultOptions: [],
    meta: {
        docs: {
            description: "disallow unnecessary as const assertions.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-unnecessary-as-const.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Unnecessary as const assertion.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-unnecessary-as-const",
});

export default rule;
