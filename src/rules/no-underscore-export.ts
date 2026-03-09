import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = [
    "ExportNamedDeclaration > FunctionDeclaration > Identifier.id[name=/^_/u]",
    "ExportNamedDeclaration > TSDeclareFunction > Identifier.id[name=/^_/u]",
    "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > Identifier.id[name=/^_/u]",
].join(", ");

/**
 * Disallow named exports whose identifier starts with an underscore.
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
            description: "disallow underscore-prefixed named exports.",
            recommended: false,
            url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/no-underscore-export.md",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "No underscore exports.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "no-underscore-export",
});

export default rule;
