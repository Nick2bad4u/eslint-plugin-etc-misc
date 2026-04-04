import type { TSESTree as es } from "@typescript-eslint/utils";

import { arrayJoin } from "ts-extras";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = arrayJoin(
    [
        "ExportNamedDeclaration > FunctionDeclaration > Identifier.id[name=/^_/u]",
        "ExportNamedDeclaration > TSDeclareFunction > Identifier.id[name=/^_/u]",
        "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > Identifier.id[name=/^_/u]",
    ],
    ", "
);

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
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "disallow underscore-prefixed named exports.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/no-underscore-export",
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
