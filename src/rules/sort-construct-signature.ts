import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "TSInterfaceBody > TSConstructSignatureDeclaration:not(:first-child)";

/**
 * Require interface construct signatures to appear before all other members.
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
                "require construct signatures to be the first member in interfaces.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/sort-construct-signature",
        },
        hasSuggestions: false,
        messages: {
            forbidden: "Construct signature should be first.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "sort-construct-signature",
});

export default rule;
