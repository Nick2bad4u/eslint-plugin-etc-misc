import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "PropertyDefinition > Identifier.value[name='undefined'], VariableDeclarator > Identifier.init[name='undefined']";

/**
 * Disallow explicit initialization to `undefined`.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> =
    ruleCreator<Options, MessageIds>({
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
                description: "disallow unnecessary initialization to undefined.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-unnecessary-initialization.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Unnecessary initialization to undefined.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "no-unnecessary-initialization",
    });

export default rule;
