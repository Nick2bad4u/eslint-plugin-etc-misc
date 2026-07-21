import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "Program[body.length>1]:has(ExportDefaultDeclaration)";

/**
 * Disallow additional exports when a default export exists.
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
                "disallow additional exports alongside a default export.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/prefer-only-export",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Export default should be only export.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "prefer-only-export",
});

export default rule;
