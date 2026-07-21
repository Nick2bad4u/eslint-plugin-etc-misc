import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "TSInterfaceBody > TSCallSignatureDeclaration:not(:first-child)";

/**
 * Require interface call signatures to appear before all other members.
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
            description:
                "require call signatures to be the first member in interfaces.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-call-signature",
        },
        hasSuggestions: false,
        languages: ["js/js"],
        messages: {
            forbidden: "Call signature should be first.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-call-signature",
});

export default rule;
