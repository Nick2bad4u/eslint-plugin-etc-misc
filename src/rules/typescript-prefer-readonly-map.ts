import type { TSESTree as es } from "@typescript-eslint/utils";

import { ruleCreator } from "../_internal/rule-creator.js";

type MessageIds = "forbidden";

type Options = readonly [];

const selector = "TSTypeReference > Identifier[name='Map']";

/**
 * Require ReadonlyMap in place of Map type annotations.
 */
const rule: ReturnType<typeof ruleCreator<Options, MessageIds>> = ruleCreator<
    Options,
    MessageIds
>({
    create: (context) => ({
        [selector]: (node: Readonly<es.Node>): void => {
            if (node.type !== "Identifier") {
                return;
            }

            context.report({
                fix: (fixer) => fixer.replaceText(node, "ReadonlyMap"),
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
                "require ReadonlyMap instead of Map in type annotations.",
            frozen: false,
            recommended: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-etc-misc/docs/rules/typescript-prefer-readonly-map",
        },
        fixable: "code",
        hasSuggestions: false,
        messages: {
            forbidden: "Prefer readonly map types.",
        },
        schema: [],
        type: "suggestion",
    },
    name: "typescript/prefer-readonly-map",
});

export default rule;
