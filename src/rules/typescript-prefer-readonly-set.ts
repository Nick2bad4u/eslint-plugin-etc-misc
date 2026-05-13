import type { TSESTree as es } from "@typescript-eslint/utils";

import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSTypeReference > Identifier[name='Set']";

/**
 * Require ReadonlySet in place of Set type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== AST_NODE_TYPES.Identifier) {
                return;
            }

            context.report({
                fix: (fixer) => fixer.replaceText(node, "ReadonlySet"),
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
                "require ReadonlySet instead of Set in type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-set",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Prefer readonly set types.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-set",
});

export default rule;
