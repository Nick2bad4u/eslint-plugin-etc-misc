import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSIndexSignature[readonly!=true]";

/**
 * Require readonly index signatures.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== "TSIndexSignature" || node.readonly) {
                return;
            }

            context.report({
                fix: (fixer) => fixer.insertTextBefore(node, "readonly "),
                messageId: "forbidden",
                node,
            });
        },
    }),
    meta: {
        deprecated: false,
        docs: {
            deprecated: false,
            description: "require readonly index signatures.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-index-signature",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Prefer readonly index signatures.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-index-signature",
});

export default rule;
