import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector = String.raw`Identifier[name=/[^$\w]/u]`;

/**
 * Restrict identifiers to latin letters, digits, underscores, and dollar signs.
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
        deprecated: false,
        docs: {
            deprecated: false,
            description:
                "require identifiers to contain only english characters, digits, underscore, or dollar sign.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/restrict-identifier-characters",
        },
        hasSuggestions: false,
        messages: {
            forbidden:
                "Identifier must consist of english characters and dollar sign.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "restrict-identifier-characters",
});

export default rule;
