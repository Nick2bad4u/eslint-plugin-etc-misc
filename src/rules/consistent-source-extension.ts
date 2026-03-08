import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = String.raw`Literal.source[value=/\.(?:js|json|ts)$/u]`;

/**
 * Disallow explicit `.js`, `.json`, and `.ts` source extensions in imports/exports.
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
                description:
                    "require consistent import/export source paths without file extensions.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/consistent-source-extension.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Remove the source file extension from this import/export path.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "consistent-source-extension",
    });

export default rule;
