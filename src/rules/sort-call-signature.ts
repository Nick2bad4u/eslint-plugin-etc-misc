import type {
    TSESTree as es,
} from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator";

type MessageIds = "forbidden";

type Options = readonly [];

const disallowedSelector =
    "TSInterfaceBody > TSCallSignatureDeclaration:not(:first-child)";

/**
 * Require interface call signatures to appear before all other members.
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
                description: "require call signatures to be the first member in interfaces.",
                recommended: false,
                url: "https://github.com/Nick2bad4u/eslint-plugin-etc-misc/blob/main/docs/rules/sort-call-signature.md",
            },
            hasSuggestions: false,
            messages: {
                forbidden: "Call signature should be first.",
            },
            schema: [],
            type: "suggestion",
        },
        name: "sort-call-signature",
    });

export default rule;
